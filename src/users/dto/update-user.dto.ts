import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
    name?: string;
    surname?: string;
    password?: string;
}
