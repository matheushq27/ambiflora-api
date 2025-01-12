import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Pagination } from 'prisma/helpers/pagination';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
