import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnmProcessesService {
  constructor(
    private readonly prisma: PrismaService
  ) { }
  async create() {
    /* const processes = await this.prisma.anmProcesses.create({
      data: {
        number: 1,
        year: 2025,
        userId: 1
      }
    }) */
  }
}
