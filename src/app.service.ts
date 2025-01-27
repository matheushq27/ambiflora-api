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

    /*  const result = await this.prisma.mineralProcesso.findFirst({
       where: {
         DSProcesso: '813.654/1973'
       },
       select: {
 
       },
     })
  */
    const mineralPessoa = await this.prisma.mineralPessoa.findMany({
      where: {
        NRCPFCNPJ: '76807353000160'
      },
      include: {
        mineralProcessoPessoa: true
      }
    })

    return {
      mineralPessoa
    }

    /* const cpfCnpj = '81180624149'


    const uuuu = await this.prisma.user.findFirst({
      where: {
        id: 1
      },
      include: {
        anmProcesses: true
      }
    })

    const processes = await this.prisma.anmProcesses.findMany({
      where: {
        cpfCnpj
      }
    })

    const senEmail = processes.map(({ number, year, currentPhase, requirementType }) => {
      return {
        name: requirementType,
        numberYear: `${number}/${year}`,
        lastPhase: currentPhase,
        currentPhase
      }
    })

    await this.email.sendEmailUpdateProcesses({
      to: 'matheus.e.arruda@gmail.com',
      processes: senEmail,
      user: {
        name: 'Matheus'
      }
    }) */
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
