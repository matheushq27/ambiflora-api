import { Controller, Get, Post, Body, Param, Delete, HttpCode, UseGuards, Query, DefaultValuePipe, ParseIntPipe, ParseBoolPipe, Put, UsePipes, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infrastructure/auth/auth/jwt-auth.guard';
import { CurrentUser } from '@/infrastructure/auth/auth/current-user-decorator';
import { UserPayload } from '@/infrastructure/auth/auth/jwt.strategy';
import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { FoldersService } from '../../../application/use-cases/folders.service';

@ApiTags('folders')
@ApiSecurity('Bearer')
@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) { }

    @Post()
    @HttpCode(200)
    async create(@Body() body: { name: string }, @CurrentUser() userPayload: UserPayload) {
        return await this.foldersService.create({
            name: body.name,
            userId: userPayload.user.id
        })
    }

    @Get()
    async findManyUser(@CurrentUser() userPayload: UserPayload,
        @Query('name') name: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number
    ) {
        return await this.foldersService.findManyUser(userPayload.user.id, { name, page, perPage })
    }

    @Get('/options')
    async findManyUserOptions(@CurrentUser() userPayload: UserPayload
    ) {
        return await this.foldersService.findManyUserOptions(userPayload.user.id)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {

    }

    @Put(':uuid')
    async update(@Param('uuid') uuid: string, @Body() body: { name: string }) {
        return await this.foldersService.update(uuid, body)
    }

    @Delete(':uuid')
    async remove(@Param('uuid') uuid: string) {
        return await this.foldersService.remove(uuid)
    }

    @Post('/delete-many')
    @HttpCode(200)
    async deleteAll(@Body() body: number[]) {

    }
}
