import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScrapeService } from 'src/scrape-processes/services/scrape.service';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { Prisma } from '@prisma/client';
import { Pagination } from 'prisma/helpers/pagination';

interface ConsultParams {
  cpfCnpj: string
  active: string
  relationship: string
  name: string
  processNumber: string
}

export interface Person {
  cpfCnpj: string
  name: string
  relationship: {
    id: number
    name: string
  }
}

@Injectable()
export class AnmProcessesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scrapeService: ScrapeService,
    protected pagination: Pagination,
  ) { }
  async consult({ cpfCnpj, active, relationship, name, processNumber }: ConsultParams, paginate = { page: 1, perPage: 10 }) {

    const { page, perPage } = paginate

    const takeSkip = this.pagination.takeSkip(page, perPage)


    cpfCnpj = cpfCnpj.replace(/\D/g, '')

    if (cpfValidator.isValid(cpfCnpj)) {
      cpfCnpj = `***${cpfCnpj.slice(3, 9)}**`
    }

    const where: Prisma.MineralProcessoWhereInput = {}
    const whereMineralProcessoPessoa: Prisma.MineralProcessoPessoaWhereInput | undefined = undefined

    if (cpfCnpj) {
      where.MineralProcessoPessoa = {
        some: {
          MineralPessoa: {
            NRCPFCNPJ: cpfCnpj
          }
        }
      }
    }

    if (processNumber) {
      where.DSProcesso = processNumber
    }

    if (name) {
      where.MineralProcessoPessoa = {
        some: {
          MineralPessoa: {
            NMPessoa: {
              contains: name,
              mode: 'insensitive'
            }
          }
        }
      }
    }

    if (relationship !== '0') {
      where.MineralProcessoPessoa.some.MineralTipoRelacao.IDTipoRelacao = relationship
      whereMineralProcessoPessoa.IDTipoRelacao = relationship
    }

    if (active === 'S' || active === 'N') { 
      where.BTAtivo = active
    }

   const [processes, total] = await this.prisma.$transaction([
      this.prisma.mineralProcesso.findMany({
        relationLoadStrategy: 'join',
        where,
        include: {
          MineralFaseProcesso: true,
          MineralProcessoSubstancia: {
            include: {
              MineralSubstancia: true,
              MineralTipoUsoSubstancia: true
            }
          },
          MineralProcessoPessoa: {
            where: whereMineralProcessoPessoa,
            include: {
              MineralPessoa: true,
              MineralTipoRelacao: true
            }
          },
          MineralTipoRequerimento: true,
          MineralProcessoMunicipio: {
            include: {
              MineralMunicipio: true
            }
          }
        },
        orderBy: {
          NRAnoProcesso: 'desc'
        },
        take: takeSkip.take,
        skip: takeSkip.skip
      }),
      this.prisma.mineralProcesso.count({
          where,
      })
    ])

    const pagination = this.pagination.paginate({ total, page })

    return {
      data: processes.map((process) => {
        const { BTAtivo, DSProcesso, NRProcesso, NRAnoProcesso, MineralFaseProcesso, MineralProcessoSubstancia, MineralProcessoPessoa, MineralTipoRequerimento, MineralProcessoMunicipio } = process

        const relatedPeople = MineralProcessoPessoa.map((data) => {
          const { DSTipoRelacao, IDTipoRelacao } = data.MineralTipoRelacao
          const { NRCPFCNPJ, NMPessoa } = data.MineralPessoa

          return {
            cpfCnpj: NRCPFCNPJ, name: NMPessoa, DSTipoRelacao, IDTipoRelacao,
            relationship: {
              id: +IDTipoRelacao,
              name: DSTipoRelacao
            }
          }
        })

        const substances = MineralProcessoSubstancia.map((substancia) => {
          const { IDSubstancia, NMSubstancia } = substancia.MineralSubstancia
          return {
            id: +IDSubstancia,
            name: NMSubstancia
          }
        })

        const typeOfUse = MineralProcessoSubstancia.map((mineralProcessoSubstancia)=>{
            const {DSTipoUsoSubstancia, IDTipoUsoSubstancia} = mineralProcessoSubstancia.MineralTipoUsoSubstancia
            return{
              id: +IDTipoUsoSubstancia,
              name: DSTipoUsoSubstancia
            }
        })

        const municipalities = MineralProcessoMunicipio.map((mineralProcessoMunicipio)=>{
          const {IDMunicipio, MineralMunicipio} = mineralProcessoMunicipio
          return{
            id: +IDMunicipio,
            name: MineralMunicipio.NMMunicipio,
            state: MineralMunicipio.SGUF
          }
        })
        
        return {
          process: DSProcesso,
          processNumber: NRProcesso,
          active: BTAtivo === 'S',
          year: NRAnoProcesso,
          relatedPeople,
          substances,
          typeOfUse,
          municipalities,
          requirement: {
            id: +MineralTipoRequerimento.IDTipoRequerimento,
            title: MineralTipoRequerimento.DSTipoRequerimento,
          },
          phase: {
            id: +MineralFaseProcesso.IDFaseProcesso,
            title: MineralFaseProcesso.DSFaseProcesso
          }
        }
      }),
      ...pagination
    } 
  }

  async findByProcessNumber(processNumber: string){
      const process = await this.prisma.mineralProcesso.findFirst({
        relationLoadStrategy: 'join',
        where:{
          DSProcesso: processNumber
        },
        include: {
          MineralFaseProcesso: true,
          MineralProcessoSubstancia: {
            include: {
              MineralSubstancia: true,
              MineralTipoUsoSubstancia: true
            }
          },
          MineralProcessoPessoa: {
            //where: whereMineralProcessoPessoa,
            include: {
              MineralPessoa: true,
              MineralTipoRelacao: true
            }
          },
          MineralTipoRequerimento: true,
          MineralProcessoMunicipio: {
            include: {
              MineralMunicipio: true
            }
          }
        }
      })

      return{
        process: this.mapResults(process)
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

  async findHoldersByName(name: string) {

    const processesPrisma = this.prisma.paginationExtension()
    const [holders] = await processesPrisma.mineralPessoa.paginate({
      where: {
        NMPessoa: {
          contains: name,
          mode: 'insensitive'
        }
      }
    }).withPages({
      limit: 10,
      page: 1,
      includePageCount: true,
    })

    return {
      data: holders
    }

  }

  mapResults(process: any){
    const { BTAtivo, DSProcesso, NRProcesso, NRAnoProcesso, MineralFaseProcesso, MineralProcessoSubstancia, MineralProcessoPessoa, MineralTipoRequerimento, MineralProcessoMunicipio } = process

    const relatedPeople = MineralProcessoPessoa.map((data) => {
      const { DSTipoRelacao, IDTipoRelacao } = data.MineralTipoRelacao
      const { NRCPFCNPJ, NMPessoa } = data.MineralPessoa

      return {
        cpfCnpj: NRCPFCNPJ, name: NMPessoa, DSTipoRelacao, IDTipoRelacao,
        relationship: {
          id: +IDTipoRelacao,
          name: DSTipoRelacao
        }
      }
    })

    const substances = MineralProcessoSubstancia.map((substancia) => {
      const { IDSubstancia, NMSubstancia } = substancia.MineralSubstancia
      return {
        id: +IDSubstancia,
        name: NMSubstancia
      }
    })

    const typeOfUse = MineralProcessoSubstancia.map((mineralProcessoSubstancia)=>{
        const {DSTipoUsoSubstancia, IDTipoUsoSubstancia} = mineralProcessoSubstancia.MineralTipoUsoSubstancia
        return{
          id: +IDTipoUsoSubstancia,
          name: DSTipoUsoSubstancia
        }
    })

    const municipalities = MineralProcessoMunicipio.map((mineralProcessoMunicipio)=>{
      const {IDMunicipio, MineralMunicipio} = mineralProcessoMunicipio
      return{
        id: +IDMunicipio,
        name: MineralMunicipio.NMMunicipio,
        state: MineralMunicipio.SGUF
      }
    })
    
    return {
      process: DSProcesso,
      processNumber: NRProcesso,
      active: BTAtivo === 'S',
      year: NRAnoProcesso,
      relatedPeople,
      substances,
      typeOfUse,
      municipalities,
      requirement: {
        id: +MineralTipoRequerimento.IDTipoRequerimento,
        title: MineralTipoRequerimento.DSTipoRequerimento,
      },
      phase: {
        id: +MineralFaseProcesso.IDFaseProcesso,
        title: MineralFaseProcesso.DSFaseProcesso
      }
    }
  }
}
