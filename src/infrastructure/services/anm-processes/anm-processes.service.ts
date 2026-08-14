import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { Prisma } from '@prisma/client';
import { Pagination } from 'prisma/helpers/pagination';

interface ConsultParams {
  cpfCnpj: string
  active: string
  relationship: string
  name: string
  processNumber: string
  onlyProcessNumbers?: boolean
  monitored: boolean
  folderUUID: string
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
    protected pagination: Pagination,
  ) { }
  async consult({ cpfCnpj, active, relationship, name, processNumber, onlyProcessNumbers, monitored, folderUUID }: ConsultParams, paginate = { page: 1, perPage: 10 }, userId: number) {

    const { page, perPage } = paginate

    const takeSkip = this.pagination.takeSkip(page, perPage)


    cpfCnpj = cpfCnpj.replace(/\D/g, '')

    if (cpfValidator.isValid(cpfCnpj)) {
      cpfCnpj = `***${cpfCnpj.slice(3, 9)}**`
    }

    const where: Prisma.ProcessoWhereInput = {}

    const pessoaConditions: any = {}

    if (cpfCnpj) {
      pessoaConditions.NRCPFCNPJ = cpfCnpj
    }

    if (name) {
      pessoaConditions.NMPessoa = {
        contains: name,
        mode: 'insensitive'
      }
    }

    const processoPessoaSome: any = {}

    if (processNumber) {
      where.DSProcesso = processNumber
    }

    if (Object.keys(pessoaConditions).length > 0) {
      processoPessoaSome.Pessoa = pessoaConditions
    }

    if (relationship && relationship !== '0') {
      processoPessoaSome.TipoRelacao = {
        IDTipoRelacao: relationship
      }
    }

    if (Object.keys(processoPessoaSome).length > 0) {
      where.ProcessoPessoa = {
        some: processoPessoaSome
      }
    }

    if (active === 'S' || active === 'N') {
      where.BTAtivo = active
    }

    const monitoredIsBoolean = typeof monitored === 'boolean'
    const searchForMonitoredProcesses = onlyProcessNumbers || monitoredIsBoolean
    let monitoredProcesses: {
      processNumber: string;
    }[] = []

    if (searchForMonitoredProcesses) {
      monitoredProcesses = await this.prisma.monitoredProcesses.findMany({
        where: {
          Folders: {
            userId,
            uuid: folderUUID ? folderUUID : {}
          }
        },
        select: {
          processNumber: true
        }
      })
    }

    if (monitoredIsBoolean) {
      if (monitored) {
        where.DSProcesso = {
          in: monitoredProcesses.map((m) => {
            return m.processNumber
          })
        }
      } else {
        where.DSProcesso = {
          notIn: monitoredProcesses.map((m) => {
            return m.processNumber
          })
        }
      }
    }

    if (onlyProcessNumbers) {

      where.DSProcesso = {
        notIn: monitoredProcesses.map((m) => {
          return m.processNumber
        })
      }

      const processes = await this.prisma.processo.findMany({
        relationLoadStrategy: 'join',
        where,
        select: {
          DSProcesso: true
        }
      })

      return processes.map((p) => {
        return p.DSProcesso
      })
    }

    console.log(JSON.stringify(where))


    const [processes, total] = await this.prisma.$transaction([
      this.prisma.processo.findMany({
        relationLoadStrategy: 'join',
        where,
        include: {
          FaseProcesso: true,
          TipoRequerimento: true,
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

    console.log(onlyProcessNumbers)

    const processNumberId = processes.map((p) => {
      return p.DSProcesso
    })


    const _monitored = await this.prisma.monitoredProcesses.findMany({
      where: {
        processNumber: {
          in: processNumberId
        },
        Folders: {
          userId
        }
      }
    })

    const processoSubstancia = await this.prisma.processoSubstancia.findMany({
      where: {
        DSProcesso: {
          in: processNumberId
        },
      },
      include: {
        Substancia: true,
        TipoUsoSubstancia: true
      },
      //distinct: 'IDTipoUsoSubstancia'
    })

    const processoPessoa = await this.prisma.processoPessoa.findMany({
      where: {
        DSProcesso: {
          in: processNumberId
        },
      },
      include: {
        Pessoa: true,
        TipoRelacao: true
      }
    })

    const processoMunicipio = await this.prisma.processoMunicipio.findMany({
      where: {
        DSProcesso: {
          in: processNumberId
        }
      },
      include: {
        Municipio: true
      }
    })

    const processoEvento = await this.prisma.processoEvento.findMany({
      where: {
        DSProcesso: {
          in: processNumberId
        }
      },
      include: {
        Evento: true,
      },
      orderBy: {
        DTEvento: 'desc'
      }
    })


    const pagination = this.pagination.paginate({ total, page })
    console.log(processoSubstancia)
    return {
      data: processes.map((process) => {
        const { BTAtivo, DSProcesso, NRProcesso, NRAnoProcesso, FaseProcesso, TipoRequerimento } = process

        const relatedPeople = processoPessoa.filter(p => p.DSProcesso === DSProcesso).map((data) => {
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

        const processoSubstanciaFilter = processoSubstancia.filter(p => p.DSProcesso === DSProcesso)
        const substances = processoSubstanciaFilter.map((substancia) => {
          const { IDSubstancia, NMSubstancia } = substancia.Substancia
          return {
            id: +IDSubstancia,
            name: NMSubstancia
          }
        })

        const typeOfUse: { id: number, name: string }[] = []

        processoSubstanciaFilter.map((ProcessoSubstancia) => {
          const { DSTipoUsoSubstancia, IDTipoUsoSubstancia } = ProcessoSubstancia.TipoUsoSubstancia
          const id = +IDTipoUsoSubstancia
          const typeOfUseIds = typeOfUse.map((t) => {
            return t.id
          })

          if (!typeOfUseIds.includes(id)) {
            typeOfUse.push({
              id,
              name: DSTipoUsoSubstancia
            })
          }
        })


        const municipalities = processoMunicipio.filter(p => p.DSProcesso === DSProcesso).map((ProcessoMunicipio) => {
          const { IDMunicipio, Municipio } = ProcessoMunicipio
          return {
            id: +IDMunicipio,
            name: Municipio.NMMunicipio,
            state: Municipio.SGUF
          }
        })

        const events = processoEvento.filter(p => p.DSProcesso === DSProcesso).map((processoEvento) => {
          const { DSEvento, IDEvento } = processoEvento.Evento
          return {
            name: DSEvento,
            date: processoEvento.DTEvento,
            eventId: +IDEvento,
            description: `${IDEvento} - ${DSEvento}`
          }
        })

        const monitoredProcesses = _monitored.filter(p => p.processNumber === DSProcesso)

        const currentEvent = events.length > 0 ? events[0] : null

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
            id: TipoRequerimento ? +TipoRequerimento.IDTipoRequerimento : 0,
            title: TipoRequerimento ? TipoRequerimento.DSTipoRequerimento : '',
          },
          phase: {
            id: FaseProcesso ? +FaseProcesso.IDFaseProcesso : 0,
            title: FaseProcesso ? FaseProcesso.DSFaseProcesso : ''
          },
          events,
          currentEvent,
          monitored: monitoredProcesses.length > 0
        }
      }),
      ...pagination
    }
  }

  async findByProcessNumber(processNumber: string) {
    const process = await this.prisma.processo.findFirst({
      relationLoadStrategy: 'join',
      where: {
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

    return {
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

  mapResults(process: any) {
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

    const typeOfUse = ProcessoSubstancia.map((ProcessoSubstancia) => {
      const { DSTipoUsoSubstancia, IDTipoUsoSubstancia } = ProcessoSubstancia.TipoUsoSubstancia
      return {
        id: +IDTipoUsoSubstancia,
        name: DSTipoUsoSubstancia
      }
    })

    const municipalities = ProcessoMunicipio.map((ProcessoMunicipio) => {
      const { IDMunicipio, Municipio } = ProcessoMunicipio
      return {
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

  async notMonitorProject({ processNumber, userId }: { processNumber: string, userId: number }) {
    const monitored = await this.prisma.monitoredProcesses.findFirst({
      where: {
        processNumber,
        Folders: {
          userId
        }
      }
    })

    if (!monitored) {
      throw new NotFoundException('Projeto não encontrado')
    }

    await this.prisma.monitoredProcesses.delete({
      where: {
        id: monitored.id
      }
    })
  }

  async monitorProject({ processNumber, folderId }: { processNumber: string, folderId: string }) {
    const exist = await this.prisma.processo.findFirst({
      where: {
        DSProcesso: processNumber
      },
    })

    if (!exist) {
      throw new NotFoundException('Projeto não encontrado')
    }


    const processoEvento = await this.prisma.processoEvento.findMany({
      where: {
        DSProcesso: processNumber
      },
      include: {
        Evento: true,
      },
      orderBy: {
        DTEvento: 'desc'
      }
    })

    let lastEventId = 0

    if (processoEvento.length > 0) {
      lastEventId = +processoEvento[0].IDEvento
    }

    await this.prisma.monitoredProcesses.create({
      data: {
        folderUUid: folderId,
        lastEventId,
        processNumber,
      }
    })
  }

  async monitorMultipleProject({ processNumbers, folderId, userId }: { processNumbers: string[], folderId: string, userId: number }) {

    const processoEventos = await this.prisma.processoEvento.findMany({
      where: {
        DSProcesso: {
          in: processNumbers
        }
      },
      include: {
        Evento: true,
      },
      orderBy: {
        DTEvento: 'desc'
      }
    })

    const data = processNumbers.map((processNumber) => {
      const filter = processoEventos.filter(pe => pe.DSProcesso === processNumber)

      const latest = filter.reduce((latest, currentEvent) => {
        return new Date(currentEvent.DTEvento) > new Date(latest.DTEvento)
          ? currentEvent
          : latest;
      });
      return {
        folderUUid: folderId,
        processNumber,
        lastEventId: +latest.IDEvento
      }
    })

    await this.prisma.monitoredProcesses.createMany({
      data
    })

  }

}
