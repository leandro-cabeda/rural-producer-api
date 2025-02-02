import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from '../producer/entity/producer.entity';
import { Farm } from './entity/farm.entity';
import { CustomLogger } from '../../logger/logger.service';

@Injectable()
export class FarmService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,

    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) { }

  async create(data: Farm): Promise<Farm> {

    this.logger.log("Validando as informações da fazenda");
    this.validateFarmAreas(data);

    this.logger.log(`Criando fazenda: ${JSON.stringify(data)}`);

    const producer = await this.producerRepository.findOne({ where: { id: data.producer.id } });
    if (!producer) {
      this.logger.error('Produtor não encontrado');
      throw new NotFoundException('Produtor não encontrado');
    }

    delete data.id;

    for (const crop of data.crops) {
      delete crop.id;
    }

    for (const harvest of data.harvests) {
      delete harvest.id;

      for (const crop of data.crops) {
        if (harvest.crops.find(c => c.name === crop.name)) {
          crop.harvest = harvest;
        }
      }

      delete harvest.crops;
    }

    return await this.farmRepository.save(data);

  }

  async findAll(): Promise<Farm[]> {
    this.logger.log('Buscando todas as fazendas');
    return await this.farmRepository.
      createQueryBuilder('farm')
      .leftJoinAndSelect('farm.producer', 'producer')
      .leftJoinAndSelect('farm.crops', 'crop')
      .leftJoinAndSelect('farm.harvests', 'harvest')
      .select([
        'farm.id',
        'farm.name',
        'farm.city',
        'farm.state',
        'farm.totalArea',
        'farm.arableArea',
        'farm.vegetationArea',
        'producer.id',
        'producer.name',
        'producer.cpfCnpj',
        'crop.id',
        'crop.name',
        'crop.year',
        'harvest.id',
        'harvest.year'
      ])
      .orderBy('farm.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Farm> {
    this.logger.log(`Buscando fazenda: ${id}`);
    id = Number(id);

    if (isNaN(id)) {
      this.logger.error('Id inválido');
      throw new BadRequestException('Id inválido');
    }

    const farm = await this.farmRepository
      .createQueryBuilder('farm')
      .leftJoinAndSelect('farm.producer', 'producer')
      .leftJoinAndSelect('farm.crops', 'crop')
      .leftJoinAndSelect('farm.harvests', 'harvest')
      .where('farm.id = :id', { id })
      .getOne();

    if (!farm) {
      this.logger.error('Fazenda não encontrada');
      throw new NotFoundException('Fazenda não encontrada');
    }


    return farm;
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Deletando fazenda: ${id}`);
    id = Number(id);

    if (isNaN(id)) {
      this.logger.error('Id inválido');
      throw new BadRequestException('Id inválido');
    }

    const farm = await this.findOne(id);

    if (!farm) {
      this.logger.error('Fazenda não encontrada');
      throw new NotFoundException('Fazenda não encontrada');
    }

    await this.farmRepository.remove(farm);
  }

  async update(id: number, data: Farm): Promise<Farm> {

    id = Number(id);

    if (isNaN(id)) {
      this.logger.error('Id inválido');
      throw new BadRequestException('Id inválido');
    }

    this.logger.log("Validando as informações da fazenda");
    this.validateFarmAreas(data);

    this.logger.log(`Atualizando fazenda: ${id}`);
    const farm = await this.findOne(id);

    if (!farm) {
      this.logger.error('Fazenda não encontrada');
      throw new NotFoundException('Fazenda não encontrada');
    }

    data.id = id;
    return await this.farmRepository.save(data);
  }

  private validateFarmAreas(data: Farm) {
    const { totalArea, arableArea, vegetationArea } = data;

    if (totalArea !== undefined && arableArea !== undefined && vegetationArea !== undefined) {
      if (arableArea + vegetationArea > totalArea) {
        throw new BadRequestException(
          'A soma das áreas agricultável e de vegetação não pode ultrapassar a área total da fazenda.',
        );
      }
    }
  }

}

