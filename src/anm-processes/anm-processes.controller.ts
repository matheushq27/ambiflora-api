import { Controller, Get, Post, Body, Param, Delete, HttpCode, UseGuards, Query, DefaultValuePipe, ParseIntPipe, ParseBoolPipe, Put, UsePipes, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { UserPayload } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { AnmProcessesService } from './anm-processes.service';


@ApiTags('anmProcesses')
@ApiSecurity('Bearer')
@Controller('anm-processes')
@UseGuards(JwtAuthGuard)
export class AnmProcessesController {
    constructor(private anmProcessesService: AnmProcessesService) { }

    @Get()
    async consult(
        @CurrentUser() userPayload: UserPayload,
        @Query('cpfCnpj') cpfCnpj: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
    ) {
        return await this.anmProcessesService.consult({ cpfCnpj }, {
            page,
            perPage
        })
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {

    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {

    }
}
