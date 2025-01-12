import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-companhy.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompaniesService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createCompanhyDto: CreateCompanyDto) {

    const company = await this.prisma.company.create({
      data: createCompanhyDto
    })

    return {
      company
    }
  }

  async findAll() {
    const companhies = await this.prisma.company.findMany()
    return {
      companhies
    }
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findFirst({
      where: {
        id
      }
    })
    return {
      company
    }
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} companhy`;
  }

  remove(id: number) {
    return `This action removes a #${id} companhy`;
  }
}
