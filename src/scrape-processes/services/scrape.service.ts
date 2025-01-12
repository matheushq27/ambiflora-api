import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import puppeteer from 'puppeteer';
import { TwoCaptchaService } from 'src/two-captcha/services/two-captcha.service';

@Injectable()
export class ScrapeService {

  constructor(private readonly twoCaptchaService: TwoCaptchaService) { }

  async find() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
      // Navegar para a página
      await page.goto('https://sistemas.anm.gov.br/SCM/site/admin/dadosProcesso.aspx', {
        waitUntil: 'networkidle2',
      });

      // Capturar a imagem do CAPTCHA dentro da tr com o id ctl00_conteudo_trCaptcha
      const captchaElement = await page.$('tr#ctl00_conteudo_trCaptcha img');
      if (!captchaElement) {
        throw new Error('Imagem do CAPTCHA não encontrada.');
      }

      // Tirar o screenshot da imagem do CAPTCHA
      const captchaImage = Buffer.from(await captchaElement.screenshot());
      if (!captchaImage) {
        throw new Error('Erro ao capturar a imagem do CAPTCHA.');
      }

      // Resolver o CAPTCHA
      const captchaText = await this.twoCaptchaService.resolveCaptcha(captchaImage);

      if (!captchaText) {
        throw new Error('Erro ao resolver o CAPTCHA.');
      }

      console.log('CAPTCHA resolvido:', captchaText);

      // Preencher o número do processo
      await page.type('input[name="ctl00$conteudo$txtNumeroProcesso"]', '866.801/2023');

      // Preencher o CAPTCHA
      await page.type('input[name="ctl00$conteudo$CaptchaControl1"]', captchaText);

      // Clicar no botão de consulta
      await page.click('input[name="ctl00$conteudo$btnConsultarProcesso"]');

      // Esperar o resultado da consulta
      await page.waitForFunction('document.querySelector("#ctl00_conteudo_gridEventos") !== null');

      const nupText = await page.$eval('#ctl00_conteudo_lblNup', (element) => element.textContent);

      // Obter o conteúdo da página
      const content = await page.content();
      console.log('Consulta realizada com sucesso!');
      console.log(nupText);
      // Fazer algo com o conteúdo, como processar a resposta
    } catch (error) {
      console.error('Erro ao consultar o processo:', error);
    } finally {
      // Fechar o navegador
      //await browser.close();
    }
  }

  async findAll({ cpfCnpj }: { cpfCnpj: string }) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
      // Navegar para a página
      await page.goto('https://sistemas.anm.gov.br/SCM/Extra/site/admin/pesquisarProcessos.aspx', {
        waitUntil: 'networkidle2',
      });

      // Capturar a imagem do CAPTCHA dentro da tr com o id ctl00_conteudo_trCaptcha
      const captchaElement = await page.$('tr#ctl00_conteudo_trCaptcha img');
      if (!captchaElement) {
        throw new Error('Imagem do CAPTCHA não encontrada.');
      }

      // Tirar o screenshot da imagem do CAPTCHA
      const captchaImage = Buffer.from(await captchaElement.screenshot());
      if (!captchaImage) {
        throw new Error('Erro ao capturar a imagem do CAPTCHA.');
      }

      // Resolver o CAPTCHA
      const captchaText = await this.twoCaptchaService.resolveCaptcha(captchaImage);

      if (!captchaText) {
        throw new Error('Erro ao resolver o CAPTCHA.');
      }

      console.log('CAPTCHA resolvido:', captchaText);

      // Preencher o número do cpf ou cnpj
      await page.type('input[name="ctl00$conteudo$txtCpfCnpjTitular"]', cpfCnpj);

      // Preencher o CAPTCHA
      await page.type('input[name="ctl00$conteudo$CaptchaControl1"]', captchaText);

      // Clicar no botão de consulta
      await page.click('input[name="ctl00$conteudo$btnPesquisar"]');

      // Esperar o resultado da consulta
      await page.waitForFunction('document.querySelector("#ctl00_conteudo_gridProcessos") !== null', {
        timeout: 60000
      });


      const tableData = await page.evaluate(() => {
        const table = document.querySelector('#ctl00_conteudo_gridProcessos');
        if (!table) return [];

        // Iterar sobre as linhas da tabela
        const rows = Array.from(table.querySelectorAll('tr'));
        return rows.map(row => {
          // Iterar sobre as células de cada linha
          const cells = Array.from(row.querySelectorAll('td'));
          return cells.map(cell => cell.textContent?.trim() || '');
        });
      });

      const cleanTableData = tableData
        .filter(row => row.length > 0) // Remove arrays vazios
        .map(row =>
          row.map((cell, index) => {
            if (index === 0) { // Aplica a lógica apenas para o número do processo
              const match = cell.match(/^(\d+)\.(\d+)\/(\d+)$/);
              if (match) {
                return [`${match[1]}${match[2]}`, match[3]]; // Retorna o número separado e sem o ponto
              }
            }
            return cell.replace(/\s+/g, ' ').trim(); // Remove \n, espaços extras, e normaliza o texto
          })
        )
        .map(row => {
          // Achatar os valores do número do processo separados
          if (Array.isArray(row[0])) {
            row = [...row[0], ...row.slice(1)];
          }
          return row;
        });


      const processes = cleanTableData.map((sc) => {
        return {
          number: +sc[0],
          year: +sc[1],
          requirementType: sc[2] as string,
          currentPhase: sc[3] as string,
          cpfCnpj,
          cardholderName: sc[5] as string,
          municipalities: sc[6] as string,
          substances: sc[7] as string,
          typesOfUse: sc[8] as string,
          situation: sc[9] as string,
        }
      })

      return {
        processes
      }

    } catch (error) {
      console.error('Erro ao consultar o processo:', error);
    } finally {
      // Fechar o navegador
      //await browser.close();
    }
  }

}
