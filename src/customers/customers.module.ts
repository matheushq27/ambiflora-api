import { Module } from '@nestjs/common';
import { UsersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [CustomersService],
})
export class CustomersModule { }
