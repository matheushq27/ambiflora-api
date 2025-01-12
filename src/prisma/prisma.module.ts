import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Pagination } from 'prisma/helpers/pagination';

@Global()
@Module({
  providers: [PrismaService, Pagination],
  exports: [PrismaService, Pagination],
})
export class PrismaModule {}

