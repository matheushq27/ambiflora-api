import { Injectable } from '@nestjs/common';
import { ScrapeService } from './scrape-processes/services/scrape.service';
import { Prisma, $Enums, User } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';
import { EmailsService } from './emails/emails.service';

@Injectable()
export class AppService {
  constructor(
    private readonly scrapeService: ScrapeService,
    private readonly prisma: PrismaService,
    private readonly email: EmailsService
  ) { }
  async getHello(): Promise<any> {

    const aaa = await this.prisma.mineralProcesso.findFirst({
      where:{
        
      }
    })
  }

  async handle() {
    const cpfCnpj = '81180624149'

    const { processes } = await this.scrapeService.findAll({ cpfCnpj })

    const notify: any[] = []

    await Promise.all(
      processes.map(async (pr) => {
        const process = await this.prisma.anmProcesses.findFirst({
          where: {
            number: pr.number,
            year: pr.year
          }
        })

        if (process) {
          if (process.situation !== pr.situation) {
            console.log(`A situação do processo ${pr.number}/${pr.year} mudou para ${pr.situation}`)
          }

          await this.prisma.anmProcesses.update({
            where: {
              id: process.id
            },
            data: pr
          })
        } else {
          await this.prisma.anmProcesses.create({
            data: pr
          })
        }

      })
    )

    const findMany = await this.prisma.anmProcesses.findMany({
      where: {
        cpfCnpj
      }
    })

    return {
      processes: findMany
    }
  }
}
