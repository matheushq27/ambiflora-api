import { Module } from '@nestjs/common';
import { UsersController } from '../http/controllers/customers.controller';
import { CustomersService } from '../../application/use-cases/customers.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [CustomersService],
})
export class CustomersModule { }
