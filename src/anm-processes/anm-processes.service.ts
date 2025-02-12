import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScrapeService } from 'src/scrape-processes/services/scrape.service';

@Injectable()
export class AnmProcessesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scrapeService: ScrapeService
  ) { }
  async consult({ cpfCnpj }: { cpfCnpj: string }, paginate = { page: 1, perPage: 10 }) {
    const { processes } = await this.scrapeService.findAll({ cpfCnpj })
    return {
      processes
    }
  }
}
