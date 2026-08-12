import { Module } from '@nestjs/common';
import { UsersService } from '../../application/use-cases/users.service';
import { UsersController } from '../http/controllers/users.controller';
import { Pagination } from 'prisma/helpers/pagination';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
