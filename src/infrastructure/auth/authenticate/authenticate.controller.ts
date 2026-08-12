import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('authenticate')
@Controller('authenticate')
export class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Post()
  create(@Body() authenticateDto: AuthenticateDto) {
    return this.authenticateService.handle(authenticateDto);
  }
}
