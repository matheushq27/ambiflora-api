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
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
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
        
        // Executa updateTables em um processo separado
        this.updateTablesAsync();
        
        await this.deleteFiles()

        const { time } = this.calculateTime(start)
        console.log(`⏱️ Tempo total de execução: ${time}`);
        
        return { success: true, message: 'Importação concluída com sucesso. Atualizações de tabelas em andamento.' };
    }

    async updateTablesAsync() {
        // Esta função será executada em segundo plano
        try {
            await this.updateTables();
            console.log('✅ Processo de atualização de tabelas concluído em segundo plano.');
        } catch (error) {
            console.error('❌ Erro no processo de atualização em segundo plano:', error);
        }
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

        // Cria uma conexão separada para não bloquear a conexão principal do Prisma
        const client = new Client({
            connectionString: this.connectionString
        });
        
        await client.connect();
        
        try {
            // Configura um nível de isolamento que não bloqueie leituras
            await client.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
            
            for (const statement of statements) {
                console.log('🔹 Executando:', statement.slice(0, 100) + '...');
                
                // Verifica se o comando é para adicionar uma chave primária
                if (statement.includes('ADD CONSTRAINT') && statement.includes('PRIMARY KEY')) {
                    const tableMatch = statement.match(/ALTER TABLE "([^"]+)"/i);
                    const tableName = tableMatch ? tableMatch[1] : null;
                    const constraintName = statement.match(/ADD CONSTRAINT ([^ ]+) PRIMARY KEY/)?.[1];
                    
                    if (tableName && constraintName) {
                        // Verifica se a tabela já tem uma chave primária
                        const checkResult = await client.query(
                            `SELECT count(*) FROM information_schema.table_constraints 
                             WHERE table_name = $1 AND constraint_type = 'PRIMARY KEY'`,
                            [tableName]
                        );
                        
                        // Se já existir uma chave primária, pula este comando
                        if (Number(checkResult.rows[0].count) > 0) {
                            console.log(`⚠️ Tabela "${tableName}" já possui uma chave primária. Pulando comando.`);
                            continue;
                        }
                    }
                }
                
                try {
                    // Executa cada comando em uma transação separada
                    await client.query('BEGIN');
                    await client.query(statement);
                    await client.query('COMMIT');
                    
                    console.log(`  ✓ Comando executado com sucesso.`);
                    
                    // Pequena pausa para permitir que outras operações acessem o banco
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (err) {
                    await client.query('ROLLBACK');
                    console.error(`❌ Erro ao executar comando:`, err);
                    // Continua com o próximo comando
                }
            }
        } catch (err) {
            console.error('❌ Erro geral ao executar o script SQL:', err);
        } finally {
            await client.end();
        }

        const { time } = this.calculateTime(start)
        console.log(`⏱️ Tempo total de execução do SQL: ${time}`);
    }

    async downloadZipFile(): Promise<void> {

        if (!this.connectionString) {
            throw new BadRequestException('Banco de dados não encontrado')
        }

        const start = Date.now();
        const url = `${this.urlBase}/dadosabertos/SCM/microdados/microdados-scm.zip`;
        console.log('Iniciando o download')

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

        // Lista para armazenar os nomes das tabelas temporárias criadas
        const tempTables = [];

        for (const file of files) {
            const filePath = path.join(dir, file);
            const rawTableName = path.basename(file, '.txt');
            const tableName = `"${rawTableName}"`;
            const tempTableName = `"${rawTableName}_temp"`;
            
            // Armazena o nome da tabela temporária para uso posterior
            tempTables.push({ original: tableName, temp: tempTableName });

            // Cria uma tabela temporária em vez de substituir a original
            await this.prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${tempTableName} CASCADE;`);

            console.log(`🔄 Importando: ${filePath} → ${tempTableName}`);

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

            const headerLine = await getFirstLine(filePath);
            const columnNames = headerLine.trim().split(';').map(col => col.trim());
            const columnsForCreate = columnNames.map(col => `"${col}" TEXT`).join(', ');
            const columnsForCopy = columnNames.map(col => `"${col}"`).join(', ');

            const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tempTableName} (${columnsForCreate});`;

            try {
                await client.query(createTableQuery);
                console.log(`📦 Tabela ${tempTableName} criada`);
            } catch (err) {
                console.error(`❌ Erro ao criar a tabela ${tempTableName}:`, err);
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

            const copyStream = client.query(copyFrom(`COPY ${tempTableName} (${columnsForCopy}) FROM STDIN WITH (FORMAT csv, DELIMITER ';', NULL '', HEADER false)`));
            passthrough.pipe(copyStream);

            await new Promise<void>((resolve, reject) => {
                copyStream.on('finish', () => {
                    console.log(`✅ ${tempTableName} importada.`);
                    resolve();
                });
                copyStream.on('error', reject);
            });
        }

        // Após importar todos os dados para tabelas temporárias, renomeia as tabelas
        console.log('🔄 Substituindo tabelas antigas pelas novas...');
        
        // Inicia uma transação para garantir atomicidade na substituição das tabelas
        await client.query('BEGIN');
        
        try {
            for (const table of tempTables) {
                // Verifica se a tabela original existe
                const checkResult = await client.query(
                    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)`,
                    [table.original.replace(/"/g, '')]
                );
                
                if (checkResult.rows[0].exists) {
                    // Se existir, renomeia a original para backup e depois a temporária para original
                    // Usando aspas duplas para os nomes das tabelas e evitando sufixos problemáticos
                    await client.query(`ALTER TABLE ${table.original} RENAME TO "${table.original.replace(/"/g, '')}_backup";`);
                    await client.query(`ALTER TABLE ${table.temp} RENAME TO ${table.original};`);
                    await client.query(`DROP TABLE IF EXISTS "${table.original.replace(/"/g, '')}_backup" CASCADE;`);
                } else {
                    // Se não existir, apenas renomeia a temporária
                    await client.query(`ALTER TABLE ${table.temp} RENAME TO ${table.original};`);
                }
                
                console.log(`✅ Tabela ${table.original} atualizada com sucesso.`);
            }
            
            await client.query('COMMIT');
            console.log('✅ Todas as tabelas foram substituídas com sucesso!');
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('❌ Erro ao substituir tabelas:', err);
            throw err; // Propaga o erro para ser tratado no método handle
        }

        await client.end();

        const { time } = this.calculateTime(start)

        console.log(`✅✅✅ TABELAS IMPORTADAS COM SUCESSO ✅✅✅`);
        console.log(`⏱️ Tempo total de importação: ${time}`);
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