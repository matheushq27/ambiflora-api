import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { lastValueFrom } from 'rxjs';
import { writeFile, unlink } from 'fs/promises';
import * as https from 'https';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';
import * as path from 'path';
import { Client } from 'pg';
import { from as copyFrom } from 'pg-copy-streams';
import * as iconv from 'iconv-lite';
import * as stream from 'stream';
import * as readline from 'readline';
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ScrapeDataAnmService {

    private urlBase = 'https://app.anm.gov.br'
    private rootDir = process.cwd()
    private fileName = 'data-anm.zip'

    private connectionString = ''

    constructor(private readonly httpService: HttpService, private readonly prisma: PrismaService, private configService: ConfigService) {
        const databaseUrl = this.configService.get('DATABASE_URL');
        if (databaseUrl) {
            this.connectionString = databaseUrl
        }
    }

    async handle() {
        const start = Date.now();
        await this.downloadZipFile()
        await this.extractZip()
        await this.sendTxtToDatabaseWithCopy()
        await this.updateTables()
        await this.deleteFiles()

        const { time } = this.calculateTime(start)
        console.log(`⏱️ Tempo total de execução: ${time}`);
    }

    async downloadZipFile(): Promise<void> {

        if (!this.connectionString) {
            throw new BadRequestException('Banco de dados não encontrado')
        }

        const start = Date.now();
        const url = `${this.urlBase}/dadosabertos/SCM/microdados/microdados-scm.zip`;
        console.log('Iniciando o download');

        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });

        const response$ = this.httpService.get(url, {
            responseType: 'arraybuffer',
            httpsAgent
        });

        const response = await lastValueFrom(response$);
        await writeFile(this.fileName, response.data);

        const { time } = this.calculateTime(start)

        console.log('Arquivo ZIP salvo com sucesso!');
        console.log(`⏱️ Tempo de dowload: ${time}`);
    }

    async extractZip() {
        const fileName = this.fileName

        const caminhoZip = path.join(`${this.rootDir}`, this.fileName);

        if (!fs.existsSync(caminhoZip)) {
            console.error(`Arquivo ${fileName} não encontrado`);
            return;
        }

        console.log(`Inciando descompactação`);

        const zip = new AdmZip(caminhoZip);

        try {
            zip.extractAllTo(this.rootDir, true);
            console.log(`Arquivo ${fileName} extraído com sucesso!`);
        } catch (error) {
            console.error(`Erro ao extrair o arquivo:`, error);
        }
    }

    async deleteFiles() {
        console.log(`Removendo Arquivos...`);
        await unlink(this.fileName);
        await fs.promises.rm('microdados-scm', { recursive: true, force: true });
        console.log(`Arquivos removidos com sucesso`);
    }

    async sendTxtToDatabaseWithCopy() {

        const start = Date.now();

        const dir = `${this.rootDir}/microdados-scm`;

        const files = fs.readdirSync(dir).filter(f => f.endsWith('.txt'));

        const client = new Client({
            connectionString: this.connectionString
        });

        await client.connect();

        for (const file of files) {
            const filePath = path.join(dir, file);
            const rawTableName = path.basename(file, '.txt');
            const tableName = `"${rawTableName}"`;

            await this.prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${tableName} CASCADE;`);

            console.log(`🔄 Importando: ${filePath} → ${tableName}`);

            const getFirstLine = async (filePath: string): Promise<string> => {
                const fileStream = fs.createReadStream(filePath).pipe(iconv.decodeStream('latin1'));
                const rl = readline.createInterface({ input: fileStream });

                return new Promise((resolve, reject) => {
                    rl.on('line', (line) => {
                        rl.close();
                        resolve(line);
                    });

                    rl.on('error', reject);
                });
            };

            // Lê o cabeçalho para obter colunas
            //const headerLine = fs.readFileSync(filePath, { encoding: 'latin1' }).split('\n')[0];
            const headerLine = await getFirstLine(filePath);
            const columnNames = headerLine.trim().split(';').map(col => col.trim());
            const columnsForCreate = columnNames.map(col => `"${col}" TEXT`).join(', ');
            const columnsForCopy = columnNames.map(col => `"${col}"`).join(', ');

            const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsForCreate});`;

            try {
                await client.query(createTableQuery);
                console.log(`📦 Tabela ${tableName} criada`);
            } catch (err) {
                console.error(`❌ Erro ao criar a tabela ${tableName}:`, err);
                continue;
            }

            // Cria a stream para enviar
            const fileStream = fs.createReadStream(filePath).pipe(iconv.decodeStream('latin1'));

            // Remove o cabeçalho da stream
            const passthrough = new stream.PassThrough();
            let isFirstLine = true;

            const rl = require('readline').createInterface({ input: fileStream });
            rl.on('line', (line: string) => {
                if (isFirstLine) {
                    isFirstLine = false
                    return;
                }

                const parts = line.split(';');
                if (parts.length === columnNames.length) {
                    passthrough.write(line + '\n');
                } else {
                    console.warn(`⚠️ Linha ignorada na tabela ${rawTableName} (número de colunas incorreto):`, line);
                }
            });

            rl.on('close', async () => {
                passthrough.end();
            });

            const copyStream = client.query(copyFrom(`COPY ${tableName} (${columnsForCopy}) FROM STDIN WITH (FORMAT csv, DELIMITER ';', NULL '', HEADER false)`));
            passthrough.pipe(copyStream);

            await new Promise<void>((resolve, reject) => {
                copyStream.on('finish', () => {
                    console.log(`✅ ${tableName} importada.`);
                    resolve();
                });
                copyStream.on('error', reject);
            });
        }

        await client.end();

        const { time } = this.calculateTime(start)

        console.log(`✅✅✅ TABELAS IMPORTADAS COM SUCESSO ✅✅✅`);
        console.log(`⏱️ Tempo total de importação: ${time}`);
    }

    async updateTables() {
        const start = Date.now();
        const sqlFilePath = path.join(this.rootDir, 'src', 'update-tables.sql');
        const sqlCommands = fs.readFileSync(sqlFilePath, 'utf-8');

        console.log('📄 Executando alterações no banco');

        const statements = sqlCommands
            .split(';')
            .map(cmd => cmd.trim())
            .filter(cmd => cmd.length > 0);

        try {
            for (const statement of statements) {
                console.log('🔹 Executando:', statement.slice(0, 100) + '...');
                await this.prisma.$executeRawUnsafe(statement);
            }
        } catch (err) {
            console.error('❌ Erro ao executar o script SQL:', err);
        }

        const { time } = this.calculateTime(start)

        console.log('✅ Todos os comandos SQL executados com sucesso!');
        console.log(`⏱️ Tempo total de execução do SQL: ${time}`);
    }

    calculateTime(start: number) {
        const durationInSeconds = (Date.now() - start) / 1000;
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        return {
            time: formattedTime
        }
    }
}