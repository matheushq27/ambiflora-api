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

    const where: Prisma.ProcessoWhereInput = {}
    const whereProcessoPessoa: Prisma.ProcessoPessoaWhereInput | undefined = undefined

    if (cpfCnpj) {
      where.ProcessoPessoa = {
        some: {
          Pessoa: {
            NRCPFCNPJ: cpfCnpj
          }
        }
      }
    }

    if (processNumber) {
      where.DSProcesso = processNumber
    }

    if (name) {
      where.ProcessoPessoa = {
        some: {
          Pessoa: {
            NMPessoa: {
              contains: name,
              mode: 'insensitive'
            }
          }
        }
      }
    }

    if (relationship !== '0') {
      where.ProcessoPessoa.some.TipoRelacao.IDTipoRelacao = relationship
      whereProcessoPessoa.IDTipoRelacao = relationship
    }

    if (active === 'S' || active === 'N') { 
      where.BTAtivo = active
    }

   const [processes, total] = await this.prisma.$transaction([
      this.prisma.processo.findMany({
        relationLoadStrategy: 'join',
        where,
        include: {
          FaseProcesso: true,
          ProcessoSubstancia: {
            include: {
              Substancia: true,
              TipoUsoSubstancia: true
            }
          },
          ProcessoPessoa: {
            where: whereProcessoPessoa,
            include: {
              Pessoa: true,
              TipoRelacao: true
            }
          },
          TipoRequerimento: true,
          ProcessoMunicipio: {
            include: {
              Municipio: true
            }
          }
        },
        orderBy: {
          NRAnoProcesso: 'desc'
        },
        take: takeSkip.take,
        skip: takeSkip.skip
      }),
      this.prisma.processo.count({
          where,
      })
    ])

    const pagination = this.pagination.paginate({ total, page })

    return {
      data: processes.map((process) => {
        const { BTAtivo, DSProcesso, NRProcesso, NRAnoProcesso, FaseProcesso, ProcessoSubstancia, ProcessoPessoa, TipoRequerimento, ProcessoMunicipio } = process

        const relatedPeople = ProcessoPessoa.map((data) => {
          const { DSTipoRelacao, IDTipoRelacao } = data.TipoRelacao
          const { NRCPFCNPJ, NMPessoa } = data.Pessoa

          return {
            cpfCnpj: NRCPFCNPJ, name: NMPessoa, DSTipoRelacao, IDTipoRelacao,
            relationship: {
              id: +IDTipoRelacao,
              name: DSTipoRelacao
            }
          }
        })

        const substances = ProcessoSubstancia.map((substancia) => {
          const { IDSubstancia, NMSubstancia } = substancia.Substancia
          return {
            id: +IDSubstancia,
            name: NMSubstancia
          }
        })

        const typeOfUse = ProcessoSubstancia.map((ProcessoSubstancia)=>{
            const {DSTipoUsoSubstancia, IDTipoUsoSubstancia} = ProcessoSubstancia.TipoUsoSubstancia
            return{
              id: +IDTipoUsoSubstancia,
              name: DSTipoUsoSubstancia
            }
        })

        const municipalities = ProcessoMunicipio.map((ProcessoMunicipio)=>{
          const {IDMunicipio, Municipio} = ProcessoMunicipio
          return{
            id: +IDMunicipio,
            name: Municipio.NMMunicipio,
            state: Municipio.SGUF
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
            id: +TipoRequerimento.IDTipoRequerimento,
            title: TipoRequerimento.DSTipoRequerimento,
          },
          phase: {
            id: +FaseProcesso.IDFaseProcesso,
            title: FaseProcesso.DSFaseProcesso
          }
        }
      }),
      ...pagination
    } 
  }

  async findByProcessNumber(processNumber: string){
      const process = await this.prisma.processo.findFirst({
        relationLoadStrategy: 'join',
        where:{
          DSProcesso: processNumber
        },
        include: {
          FaseProcesso: true,
          ProcessoSubstancia: {
            include: {
              Substancia: true,
              TipoUsoSubstancia: true
            }
          },
          ProcessoPessoa: {
            //where: whereProcessoPessoa,
            include: {
              Pessoa: true,
              TipoRelacao: true
            }
          },
          TipoRequerimento: true,
          ProcessoMunicipio: {
            include: {
              Municipio: true
            }
          }
        }
      })

      return{
        process: this.mapResults(process)
      }
  }

  async findOptionsRelationship() {
    const relationship = await this.prisma.tipoRelacao.findMany({
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
    const [holders] = await processesPrisma.pessoa.paginate({
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
    const { BTAtivo, DSProcesso, NRProcesso, NRAnoProcesso, FaseProcesso, ProcessoSubstancia, ProcessoPessoa, TipoRequerimento, ProcessoMunicipio } = process

    const relatedPeople = ProcessoPessoa.map((data) => {
      const { DSTipoRelacao, IDTipoRelacao } = data.TipoRelacao
      const { NRCPFCNPJ, NMPessoa } = data.Pessoa

      return {
        cpfCnpj: NRCPFCNPJ, name: NMPessoa, DSTipoRelacao, IDTipoRelacao,
        relationship: {
          id: +IDTipoRelacao,
          name: DSTipoRelacao
        }
      }
    })

    const substances = ProcessoSubstancia.map((substancia) => {
      const { IDSubstancia, NMSubstancia } = substancia.Substancia
      return {
        id: +IDSubstancia,
        name: NMSubstancia
      }
    })

    const typeOfUse = ProcessoSubstancia.map((ProcessoSubstancia)=>{
        const {DSTipoUsoSubstancia, IDTipoUsoSubstancia} = ProcessoSubstancia.TipoUsoSubstancia
        return{
          id: +IDTipoUsoSubstancia,
          name: DSTipoUsoSubstancia
        }
    })

    const municipalities = ProcessoMunicipio.map((ProcessoMunicipio)=>{
      const {IDMunicipio, Municipio} = ProcessoMunicipio
      return{
        id: +IDMunicipio,
        name: Municipio.NMMunicipio,
        state: Municipio.SGUF
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
        id: +TipoRequerimento.IDTipoRequerimento,
        title: TipoRequerimento.DSTipoRequerimento,
      },
      phase: {
        id: +FaseProcesso.IDFaseProcesso,
        title: FaseProcesso.DSFaseProcesso
      }
    }
  }
}
