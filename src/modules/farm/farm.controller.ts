import { Controller, Get, Post, Delete, Body, Param, BadRequestException, Put } from '@nestjs/common';
import { FarmService } from './farm.service';
import { Farm } from './entity/farm.entity';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('farms')
@ApiTags('Farms')
export class FarmController {
  constructor(private readonly farmService: FarmService) { }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova fazenda' })
  @ApiResponse({ status: 200, description: 'Retornado com sucesso a fazenda criada' })
  @ApiResponse({ status: 400, description: 'Erro na criação da fazenda' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  @ApiBody({ required: true, type: Farm, description: "Dados da fazenda" })
  async create(@Body() data: Farm): Promise<Farm> {
    try {
      return await this.farmService.create(data);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Erro ao criar a fazenda: ' + error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Busca todas as fazendas' })
  @ApiResponse({ status: 200, description: 'Retornado com sucesso as fazendas' })
  @ApiResponse({ status: 400, description: 'Erro na busca das fazendas' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async findAll(): Promise<Farm[]> {
    try {
      return await this.farmService.findAll();
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Erro ao buscar as fazendas: ' + error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma fazenda pelo id' })
  @ApiResponse({ status: 200, description: 'Retornado com sucesso a fazenda' })
  @ApiResponse({ status: 400, description: 'Erro na busca da fazenda' })
  @ApiResponse({ status: 404, description: 'Fazenda nao encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  @ApiParam({ name: 'id', description: 'ID da fazenda', required: true, type: Number })
  async findOne(@Param('id') id: number): Promise<Farm> {
    try {
      return await this.farmService.findOne(id);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Erro ao buscar a fazenda: ' + error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta uma fazenda pelo id' })
  @ApiResponse({ status: 200, description: 'Retornado com sucesso a fazenda' })
  @ApiResponse({ status: 400, description: 'Erro ao deletar a fazenda' })
  @ApiResponse({ status: 404, description: 'Fazenda nao encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  @ApiParam({ name: 'id', description: 'ID da fazenda', required: true, type: Number })
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    try {
      await this.farmService.delete(id);
      return { message: 'Fazenda deletada com sucesso' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Erro ao deletar a fazenda: ' + error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma fazenda pelo id' })
  @ApiResponse({ status: 200, description: 'Retornado com sucesso a fazenda' })
  @ApiResponse({ status: 400, description: 'Erro ao atualizar a fazenda' })
  @ApiResponse({ status: 404, description: 'Fazenda nao encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  @ApiParam({ name: 'id', description: 'ID da fazenda', required: true, type: Number })
  @ApiBody({ required: true, type: Farm, description: "Dados da fazenda" })
  async update(@Param('id') id: number, @Body() data: Farm): Promise<Farm> {
    try {
      return await this.farmService.update(id, data);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Erro ao atualizar a fazenda: ' + error.message);
    }
  }
}

