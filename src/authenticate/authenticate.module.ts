import { Module } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateController } from './authenticate.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [AuthenticateController],
  providers: [AuthenticateService, UsersService],
})
export class AuthenticateModule {}
