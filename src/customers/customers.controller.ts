import { Controller, Get, Post, Body, Param, Delete, HttpCode, UseGuards, Query, DefaultValuePipe, ParseIntPipe, ParseBoolPipe, Put, UsePipes, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { UserPayload } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { CreateCustomerBodySchema, createCustomerBodySchema, CreateCustomerDto } from './dto/create-customer.dto';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { CustomersService } from './customers.service';

@ApiTags('customers')
@ApiSecurity('Bearer')
@Controller('customers')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private customersService: CustomersService) { }

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(createCustomerBodySchema))
  @ApiBody({ type: CreateCustomerDto })
  async create(@Body() body: CreateCustomerBodySchema, @CurrentUser() userPayload: UserPayload) {

    const { cpf, cnpj, type } = body

    if (cpf && !cpfValidator.isValid(cpf)) {
      throw new BadRequestException('O CPF inserido é inválido')
    }

    if (cnpj && !cnpjValidator.isValid(cnpj)) {
      throw new BadRequestException('O CNPJ inserido é inválido')
    }

    return await this.customersService.create(body, userPayload.user.companyId)
  }

  @Get()
  findAll(
    @Query('paginate', ParseBoolPipe) paginate: boolean,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
    @Query('name') name: string,
    @Query('email') email: string,
    @CurrentUser() userPayload: UserPayload
  ) {

  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {

  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number) {

  }

  @Delete(':id')
  remove(@Param('id') id: string) {

  }
}
