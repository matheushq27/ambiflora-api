import { Controller, Get, Post, Body, Param, Delete, HttpCode, UseGuards, Query, DefaultValuePipe, ParseIntPipe, ParseBoolPipe, Put } from '@nestjs/common';
import { UsersService } from '../../../application/use-cases/users.service';
import { CreateUserDto } from '../dtos/dto/create-user.dto';
import { UpdateUserDto } from '../dtos/dto/update-user.dto';
import { ApiBasicAuth, ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infrastructure/auth/auth/jwt-auth.guard';
import { CurrentUser } from '@/infrastructure/auth/auth/current-user-decorator';
import { UserPayload } from '@/infrastructure/auth/auth/jwt.strategy';

@ApiTags('users')
@ApiSecurity('Bearer')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto, @CurrentUser() userPayload: UserPayload) {

    return this.usersService.create(createUserDto, userPayload.user.companyId ?? undefined);
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
    if (paginate) {
      return this.usersService.findAllPaginate({
        page, perPage, query: {
          name,
          email
        }
      }, userPayload);
    }

    return this.usersService.findAll(page, userPayload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({
      id
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
