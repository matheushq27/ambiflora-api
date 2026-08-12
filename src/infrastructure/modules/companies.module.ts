import { Module } from '@nestjs/common';
import { CompaniesService } from '../../application/use-cases/companies.service';
import { CompaniesController } from '../http/controllers/companies.controller';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
