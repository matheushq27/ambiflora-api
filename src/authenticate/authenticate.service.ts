import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthenticateDto } from './dto/authenticate.dto';
import { JwtService } from "@nestjs/jwt";
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthenticateService {
  constructor(
    private jwt: JwtService,
    private usersService: UsersService
  ) { }
  async handle(authenticateDto: AuthenticateDto) {
    const {email} = authenticateDto
    const {user} = await this.usersService.findOne({email})

    if(!user){
      throw new NotFoundException('Usuário não encontrado')
    }

    const {id, name, surname, userType, companyId, password} = user

    const isPasswordValid = await compare(authenticateDto.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Suas credenciais não combinam');
    }

    const userToken = {
      id,
      name,
      surname,
      email,
      userType,
      companyId
    }

    const accessToken = this.jwt.sign({
      user: userToken
    })

    return {
      accessToken,
      user: userToken
    }
  }
}
