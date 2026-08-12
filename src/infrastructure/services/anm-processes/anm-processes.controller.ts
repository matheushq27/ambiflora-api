import { Controller, Get, Post, Body, Param, Delete, HttpCode, UseGuards, Query, DefaultValuePipe, ParseIntPipe, ParseBoolPipe, Put, UsePipes, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infrastructure/auth/auth/jwt-auth.guard';
import { CurrentUser } from '@/infrastructure/auth/auth/current-user-decorator';
import { UserPayload } from '@/infrastructure/auth/auth/jwt.strategy';
import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { ScrapeDataAnmService } from '@/infrastructure/services/scrape-processes/services/scrape-data-anm.service';
import { AnmProcessesService } from './anm-processes.service';
import { CreateMonitorBodySchema, createMonitorBodySchema, CreateMonitorDto, MonitorMultipleBodySchema, monitorMultipleBodySchema, MonitorMultipleDto, NotMonitorBodySchema, notMonitorBodySchema, NotMonitorDto } from './dto/create-anm-processes';


@ApiTags('anmProcesses')
@ApiSecurity('Bearer')
@Controller('anm-processes')
@UseGuards(JwtAuthGuard)
export class AnmProcessesController {
    constructor(
        private anmProcessesService: AnmProcessesService,
        private scrapeDataAnmService: ScrapeDataAnmService
    ) { }

    @Post('/sync-data')
    @HttpCode(202)
    async syncAnmData() {
        // Não utilizamos await para que a requisição não sofra timeout (leva minutos)
        this.scrapeDataAnmService.handle().catch(console.error);
        return { message: "Sincronização da ANM iniciada em background. Acompanhe os logs." };
    }

    @Get()
    async consult(
        @CurrentUser() userPayload: UserPayload,
        @Query('cpfCnpj') cpfCnpj: string,
        @Query('active') active: string,
        @Query('relationship') relationship: string,
        @Query('name') name: string,
        @Query('processNumber') processNumber: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
        @Query('onlyProcessNumbers', new DefaultValuePipe(false), ParseBoolPipe) onlyProcessNumbers: boolean,
        @Query('monitored', new DefaultValuePipe(null), new ParseBoolPipe({ optional: true })) monitored: boolean,
        @Query('folderUUID') folderUUID: string,
    ) {
        return await this.anmProcessesService.consult({ cpfCnpj, active, relationship, name, processNumber, onlyProcessNumbers, monitored, folderUUID }, {
            page,
            perPage
        }, userPayload.user.id)
    }

    @Get('/:processNumber')
    async findByProcessNumber(
        @Param('processNumber') processNumber: string,
        @Query('year') year: string
    ) {
        const p = processNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return await this.anmProcessesService.findByProcessNumber(`${p}/${year}`)
    }

    @Get('/options/relationship')
    async findOptionsRelationship() {
        return await this.anmProcessesService.findOptionsRelationship()
    }

    @Get('/search/name/:name')
    async findHoldersByName(@Param('name') name: string,) {
        return await this.anmProcessesService.findHoldersByName(name)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {

    }

    @Post('/monitor')
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(createMonitorBodySchema))
    @ApiBody({ type: CreateMonitorDto })
    async monitorProject(@Body() body: CreateMonitorBodySchema) {
        return await this.anmProcessesService.monitorProject(body)
    }

    @Post('/monitor-multiple')
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(monitorMultipleBodySchema))
    @ApiBody({ type: MonitorMultipleDto })
    async monitorAllProjects(@CurrentUser() userPayload: UserPayload, @Body() body: MonitorMultipleBodySchema) {
        return await this.anmProcessesService.monitorMultipleProject({
            userId: userPayload.user.id,
            folderId: body.folderId,
            processNumbers: body.processNumbers
        })
    }

    @Post('/not-monitor')
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(notMonitorBodySchema))
    @ApiBody({ type: NotMonitorDto })
    async notMonitorProject(@CurrentUser() userPayload: UserPayload, @Body() body: NotMonitorBodySchema) {
        return await this.anmProcessesService.notMonitorProject({
            processNumber: body.processNumber,
            userId: userPayload.user.id
        })
    }


    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {

    }
}
