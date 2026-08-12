import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TwoCaptchaService {
  private readonly API_KEY = 'dce8e3ecd77ea17d89495e386496d37f';

  constructor(private readonly httpService: HttpService){}

  async resolveCaptcha(imageBuffer: Buffer): Promise<string | null> {
    try {
      // Enviar a imagem do CAPTCHA para o 2Captcha

      const response = await firstValueFrom(this.httpService.post(
        'http://2captcha.com/in.php',
        {
          key: this.API_KEY,
          method: 'base64',
          body: imageBuffer.toString('base64'),
          json: 1,
        },
      ));

      const captchaId = response.data.request;
      console.log('CAPTCHA enviado. ID:', captchaId);

      // Aguardar a resolução do CAPTCHA
      let result;
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Esperar 5 segundos
        result = await firstValueFrom(this.httpService.get(
          `http://2captcha.com/res.php?key=${this.API_KEY}&action=get&id=${captchaId}&json=1`
        ));
        if (result.data.status === 1) {
          return result.data.request; // Texto do CAPTCHA resolvido
        }
      }
      throw new Error('Tempo esgotado para resolver o CAPTCHA.');
    } catch (error) {
      console.error('Erro ao enviar ou resolver o CAPTCHA:', error);
      return null;
    }
  }
}
