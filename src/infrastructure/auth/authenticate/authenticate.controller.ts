import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from '@/application/use-cases/users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('authenticate')
@Controller('authenticate')
export class AuthenticateController {
  constructor(
    private readonly authenticateService: AuthenticateService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  create(@Body() authenticateDto: AuthenticateDto) {
    return this.authenticateService.handle(authenticateDto);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    // Create the user with default USER type and no company.
    // We construct a CreateUserDto manually to satisfy UsersService.
    const user = await this.usersService.create({
      ...registerUserDto,
      userType: 'USER'
    });

    // Auto-login after registration
    return this.authenticateService.handle({
      email: registerUserDto.email,
      password: registerUserDto.password
    });
  }
}
