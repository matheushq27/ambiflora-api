import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { UserPayload } from 'src/auth/jwt.strategy';
import { Pagination } from 'prisma/helpers/pagination';


interface findOneParams {
  id?: number
  email?: string
}

interface FindAllPaginateParams {
  page: number
  perPage?: number
  query: {
    name?: string
    email?: string
  }
}

@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService, private readonly pagination: Pagination) { }

  async create(createUserDto: CreateUserDto, companyId: number) {

    const teste = await this.prisma.mineralProcesso.findFirst({
      where:{
        
      }
    })

    const { name, email, surname, userType } = createUserDto

    const userExist = await this.findOne({
      email
    })

    if (userExist.user) {
      throw new BadRequestException(`O email ${email} já está cadastrado em nosso sistema`)
    }

    const password = await hash(createUserDto.password, 8)

    const user = await this.prisma.user.create({
      data: {
        name,
        companyId,
        email,
        password,
        surname,
        userType
      }
    })

    if (!user) {
      throw new BadRequestException('Houve um erro ao criar o usuário')
    }

    return {
      user
    }

  }

  async findAll(page: number, userPayload: UserPayload) {
    const users = await this.prisma.user.findMany({
      where: {
        companyId: userPayload.user.companyId,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        userType: true,
        companyId: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return {
      users: users.filter(({ id }) => id !== userPayload.user.id)
    }
  }

  async findAllPaginate(params: FindAllPaginateParams, userPayload: UserPayload) {

    const { page, perPage, query: { email, name } } = params

    const takeSkip = this.pagination.takeSkip(page, perPage)

    const where: Prisma.UserWhereInput = {
      companyId: userPayload.user.companyId,
      id: {
        not: userPayload.user.id
      }
    }

    if (email) {
      where.AND = {
        email: {
          contains: email,
          mode: 'insensitive'
        }
      }
    }

    if (name) {
      where.OR = [
        {
          name: {
            contains: name,
            mode: 'insensitive'
          }
        },
        {
          surname: {
            contains: name,
            mode: 'insensitive'
          }
        }
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          userType: true,
          companyId: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          name: 'asc'
        },
        ...takeSkip
      }),
      this.prisma.user.count({ where })
    ])

    const { pagination } = this.pagination.paginate({ total, page })

    return {
      users: data,
      pagination: pagination
    }
  }

  async findOne(query: findOneParams) {
    const { id, email } = query
    const where: Prisma.UserWhereInput = {}

    if (email) {
      where.email = email
    }

    if (id) {
      where.id = id
    }

    const user = await this.prisma.user.findFirst({
      where
    })

    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }

    return {
      user
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { name, surname, password } = updateUserDto

    const { user } = await this.findOne({ id })

    const userUpdate = await this.prisma.user.update({
      where: {
        id
      },
      data: {
        name,
        surname,
        password: password ? await hash(password, 8) : user.password,
      }
    })

    return {
      user: userUpdate
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
