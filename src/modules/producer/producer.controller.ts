import { Controller, Get, Post, Body, Param, Delete, BadRequestException, Put } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { Producer } from './entity/producer.entity';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomLogger } from '../../logger/logger.service';

@Controller('producers')
@ApiTags("Producer")
export class ProducerController {
    constructor(private readonly producerService: ProducerService,
        private readonly logger: CustomLogger,) { }

    @Post()
    @ApiOperation({ summary: 'Cria um produtor rural' })
    @ApiResponse({ status: 200, description: 'Retornado um produtor rural que foi criado' })
    @ApiResponse({ status: 400, description: 'Erro ao criar um produtor rural' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    @ApiBody({ required: true, type: Producer, description: "Dados do produtor rural" })
    async create(@Body() data: Producer): Promise<Producer> {
        try {
            return await this.producerService.create(data);
        } catch (error) {
            this.logger.error('Erro ao criar o produtor: ' + error.message);
            throw new BadRequestException('Erro ao criar o produtor: ' + error.message);
        }
    }

    @Get('/dashboard')
    @ApiOperation({
        summary:
            'Retorna os dados do dashboard.',
    })
    @ApiResponse({
        status: 200,
        description: 'Retornado os dados do dashboard.',
    })
    @ApiResponse({ status: 400, description: 'Erro ao carregar o dashboard' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async getDashboardData(): 
    Promise<{ totalFarms, totalHectares, farmsByState, landUsage, cropsDistribution }> {
        try {
            return await this.producerService.getDashboardData();
        } catch (error) {
            this.logger.error('Erro ao carregar o dashboard: ' + error.message);
            throw new BadRequestException('Erro ao carregar o dashboard: ' + error.message);
        }
    }

    @Get()
    @ApiOperation({
        summary:
            'Retorna a lista de produtores rurais.',
    })
    @ApiResponse({
        status: 200,
        description: 'Retorna a lista de produtores rurais.',
    })
    @ApiResponse({ status: 400, description: 'Erro ao carregar a lista de produtores' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async findAll(): Promise<Producer[]> {
        try {
            return await this.producerService.findAll();
        } catch (error) {
            this.logger.error('Erro ao buscar os produtores: ' + error.message);
            throw new BadRequestException('Erro ao buscar os produtores: ' + error.message);
        }
    }

    @Get(':id')
    @ApiOperation({
        summary:
            'Retorna o produtor rural especifico pelo id.',
    })
    @ApiResponse({
        status: 200,
        description: 'Retornado o produtor rural especifico pelo id.',
    })
    @ApiResponse({ status: 400, description: 'Erro ao buscar produtor rural' })
    @ApiResponse({ status: 404, description: 'Produtor rural não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    @ApiParam({ name: 'id', required: true, type: Number, description: "Id do produtor rural" })
    async findOne(@Param('id') id: number): Promise<Producer> {
        try {
            return await this.producerService.findOne(id);
        } catch (error) {
            this.logger.error('Erro ao buscar o produtor: ' + error.message);
            throw new BadRequestException('Erro ao buscar o produtor: ' + error.message);
        }
    }

    @Put(':id')
    @ApiOperation({
        summary:
            'Atualiza um produtor rural especifico pelo id.',
    })
    @ApiResponse({
        status: 200,
        description: 'Atualizado o produtor rural especifico pelo id.',
    })
    @ApiResponse({ status: 400, description: 'Erro ao atualizar o produtor rural pelo id' })
    @ApiResponse({ status: 404, description: 'Produtor rural não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    @ApiParam({ name: 'id', required: true, type: Number, description: "Id do produtor rural" })
    @ApiBody({ required: true, type: Producer, description: "Dados do produtor rural" })
    async update(@Param('id') id: number, @Body() data: Producer): Promise<Producer> {
        try {
            return await this.producerService.update(id, data);
        } catch (error) {
            this.logger.error('Erro ao atualizar o produtor: ' + error.message);
            throw new BadRequestException('Erro ao atualizar o produtor: ' + error.message);
        }
    }

    @Delete(':id')
    @ApiOperation({
        summary:
            'Deleta um produtor rural especifico pelo id.',
    })
    @ApiResponse({
        status: 200,
        description: 'Deletado o produtor rural especifico pelo id.',
    })
    @ApiResponse({ status: 400, description: 'Erro ao deletar o produtor rural pelo id' })
    @ApiResponse({ status: 404, description: 'Produtor rural não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    @ApiParam({ name: 'id', required: true, type: Number, description: "Id do produtor rural" })
    async delete(@Param('id') id: number): Promise<boolean> {
        try {
            return await this.producerService.delete(id);
        } catch (error) {
            this.logger.error('Erro ao deletar o produtor: ' + error.message);
            throw new BadRequestException('Erro ao deletar o produtor: ' + error.message);
        }
    }
}
