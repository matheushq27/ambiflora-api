import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScrapeService } from 'src/scrape-processes/services/scrape.service';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { Prisma } from '@prisma/client';

interface ConsultParams {
  cpfCnpj: string
  active: string
  relationship: string
}

@Injectable()
export class AnmProcessesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scrapeService: ScrapeService
  ) { }
  async consult({ cpfCnpj, active, relationship }: ConsultParams, paginate = { page: 1, perPage: 10 }) {

    const { page, perPage } = paginate

    cpfCnpj = cpfCnpj.replace(/\D/g, '')

    if (cpfValidator.isValid(cpfCnpj)) {
      cpfCnpj = `***${cpfCnpj.slice(3, 9)}**`
    }

    const where: Prisma.MineralProcessoWhereInput = {}
    const whereMineralProcessoPessoa: Prisma.MineralProcessoPessoaWhereInput = {}

    if (cpfCnpj) {
      where.MineralProcessoPessoa.some.MineralPessoa.NRCPFCNPJ = cpfCnpj
    }

    if (relationship !== '0') {
      where.MineralProcessoPessoa.some.MineralTipoRelacao.IDTipoRelacao = relationship
      whereMineralProcessoPessoa.IDTipoRelacao = relationship
    }

    if (active === 'S' || active === 'N') {
      where.BTAtivo = active
    }

    const processesPrisma = this.prisma.paginationExtension()
    const [processes, pagination] = await processesPrisma.mineralProcesso.paginate({
      where,
      include: {
        MineralFaseProcesso: true,
        MineralProcessoSubstancia: {
          include: {
            MineralSubstancia: true
          }
        },
        MineralProcessoPessoa: {
          where: whereMineralProcessoPessoa,
          include: {
            MineralPessoa: true,
            MineralTipoRelacao: true
          }
        },
        MineralTipoRequerimento: true
      },
      orderBy: {
        NRAnoProcesso: 'desc'
      }
    }).withPages({
      limit: perPage,
      page,
      includePageCount: true,
    })

    return {
      processes: processes.map((process) => {
        const { BTAtivo, DSProcesso, NRProcesso, NRAnoProcesso, MineralFaseProcesso, MineralProcessoSubstancia, MineralProcessoPessoa, MineralTipoRequerimento } = process
        return {
          BTAtivo: BTAtivo === 'S',
          DSProcesso,
          NRProcesso,
          NRAnoProcesso,
          MineralFaseProcesso,
          MineralProcessoPessoa: MineralProcessoPessoa.filter((data) => data.MineralPessoa.NRCPFCNPJ === cpfCnpj).map((data) => {
            const { NRCPFCNPJ, NMPessoa } = data.MineralPessoa
            return {
              NRCPFCNPJ, NMPessoa
            }
          }),
          MineralSubstancia: MineralProcessoSubstancia.map((data) => {
            const { IDSubstancia, NMSubstancia } = data.MineralSubstancia
            return {
              IDSubstancia,
              NMSubstancia
            }
          }),
          MineralTipoRequerimento
        }
      }),
      pagination
    }
  }

  async findOptionsRelationship() {
    const relationship = await this.prisma.mineralTipoRelacao.findMany({
      orderBy: {
        DSTipoRelacao: 'asc'
      }
    })
    return {
      relationships: relationship.map(({ DSTipoRelacao, IDTipoRelacao }) => {
        return {
          id: +IDTipoRelacao,
          name: DSTipoRelacao
        }
      })
    }
  }
}
