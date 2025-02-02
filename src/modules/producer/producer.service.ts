import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './entity/producer.entity';
import { CustomLogger } from '../../logger/logger.service';
import { CpfCnpjValidator } from 'src/utils/validate-cpf-cnpj';

@Injectable()
export class ProducerService {
    constructor(
        private readonly logger: CustomLogger,
        @InjectRepository(Producer)
        private producerRepository: Repository<Producer>,
    ) { }

    async create(data: Producer): Promise<Producer> {
        this.logger.log(`Criando produtor: ${JSON.stringify(data)}`);

        const { cpfCnpj } = data;

        if (!CpfCnpjValidator.isValidCpfCnpj(cpfCnpj))
            throw new BadRequestException('CPF/CNPJ inválido');

        const producerExists = await this.producerRepository.findOne({ where: { cpfCnpj } });

        if (producerExists) {
            this.logger.error('Produtor ja cadastrado');
            throw new BadRequestException('Produtor ja cadastrado');
        }

        delete data.id;

        for (const farm of data.farms) {
            delete farm.id;

            for (const crop of farm.crops) {
                delete crop.id;
            }

            for (const harvest of farm.harvests) {
                delete harvest.id;

                for (const crop of farm.crops) {
                    if (harvest.crops.find(c => c.name === crop.name)) {
                        crop.harvest = harvest;
                    }
                }

                delete harvest.crops;
            }
        }

        const producer = await this.producerRepository
            .save(data);

        return producer;

    }

    async findAll(): Promise<Producer[]> {
        this.logger.log('Buscando todos os produtores');

        return await this.producerRepository
            .createQueryBuilder('producer')
            .leftJoinAndSelect('producer.farms', 'farm')
            .leftJoinAndSelect('farm.crops', 'crop')
            .leftJoinAndSelect('farm.harvests', 'harvest')
            .select([
                'producer.id', 'producer.name', 'producer.cpfCnpj',
                'farm.id', 'farm.name', 'farm.city', 'farm.state', 'farm.totalArea',
                'farm.arableArea', 'farm.vegetationArea',
                'crop.id', 'crop.name', 'crop.year',
                'harvest.id', 'harvest.year'
            ])
            .orderBy('producer.createdAt', 'DESC')
            .getMany();
    }

    async findOne(id: number): Promise<Producer> {
        this.logger.log(`Buscando produtor: ${id}`);
        id = Number(id);

        const producer = await this.producerRepository
            .createQueryBuilder("producer")
            .leftJoinAndSelect("producer.farms", "farm")
            .leftJoinAndSelect("farm.crops", "crop")
            .leftJoinAndSelect("farm.harvests", "harvest")
            .where("producer.id = :id", { id })
            .getOne();

        if (!producer) {
            this.logger.error('Produtor não encontrado');
            throw new NotFoundException('Produtor não encontrado');
        }

        return producer;
    }

    async update(id: number, data: Producer): Promise<Producer> {
        this.logger.log(`Atualizando produtor: ${id}`);
        id = Number(id);
        const producer = await this.findOne(id);

        if (!producer) {
            this.logger.error('Produtor não encontrado');
            throw new NotFoundException('Produtor não encontrado');
        }

        const { cpfCnpj } = data;
        const producerExists = await this.producerRepository.findOne({
            where: {
                cpfCnpj
            }
        });

        if (producerExists && producerExists.id !== id) {
            this.logger.error('Produtor ja cadastrado com esse CPF/CNPJ');
            throw new BadRequestException('Produtor ja cadastrado com esse CPF/CNPJ');
        }

        data.id = id;

        return await this.producerRepository.save(data);
    }

    async delete(id: number): Promise<boolean> {
        this.logger.log(`Deletando produtor: ${id}`);
        id = Number(id);
        const producer = await this.findOne(id);

        if (!producer) {
            this.logger.error('Produtor não encontrado');
            throw new NotFoundException('Produtor não encontrado');
        }

        const result = await this.producerRepository.delete(id);
        return result.affected > 0;
    }

    async getDashboardData():
        Promise<{ totalFarms, totalHectares, farmsByState, landUsage, cropsDistribution }> {
        this.logger.log('Buscando dados do dashboard');

        const producers = await this.producerRepository
            .createQueryBuilder('producer')
            .leftJoinAndSelect('producer.farms', 'farm')
            .leftJoinAndSelect('farm.crops', 'crop')
            .leftJoinAndSelect('farm.harvests', 'harvest')
            .select([
                'producer.id', 'producer.name', 'producer.cpfCnpj',
                'farm.id', 'farm.name', 'farm.city', 'farm.state', 'farm.totalArea',
                'farm.arableArea', 'farm.vegetationArea',
                'crop.id', 'crop.name', 'crop.year',
                'harvest.id', 'harvest.year'
            ])
            .orderBy('producer.createdAt', 'DESC')
            .getMany();


        // Total de fazendas
        const totalFarms = producers?.reduce(
            (sum, producer) => sum + (producer.farms?.length || 0),
            0
        ) || 0;

        // Total de hectares
        const totalHectares = producers?.reduce(
            (sum, producer) => sum + producer.farms.reduce(
                (sum, farm) => sum + (parseFloat("" + farm.totalArea) || 0),
                0
            ),
            0
        ) || 0;

        // farmsByState: soma as fazendas por estado
        const farmsByState = producers?.flatMap((producer) => producer.farms).reduce((acc, farm) => {
            acc[farm.state] = (acc[farm.state] || 0) + 1;
            return acc;
        }, {});

        // Converter para o formato desejado (array de objetos)
        const farmsByStateFormatted = Object.entries(farmsByState).map(([state, total]) => ({ state, total }));

        // landUsage: soma das áreas agricultáveis e de vegetação
        const landUsage = [
            {
                category: 'Area Agricultavel', total: producers?.flatMap((p) => p.farms).reduce(
                    (sum, f) => sum + (parseFloat("" + f.arableArea) || 0), 0)
            },
            {
                category: 'Area de Vegetacao', total: producers?.flatMap((p) => p.farms).reduce(
                    (sum, f) => sum + (parseFloat("" + f.vegetationArea) || 0), 0)
            }
        ];

        // cropsDistribution: soma as culturas
        const cropsDistribution = producers?.flatMap((p) => p.farms?.flatMap((f) => f.crops)).reduce((acc, crop) => {
            acc[crop.name] = (acc[crop.name] || 0) + 1;
            return acc;
        }, {});

        // Converter para o formato desejado (array de objetos)
        const cropsDistributionFormatted = Object.entries(cropsDistribution).map(([crop, total]) => ({ crop, total }));

        return { totalFarms, totalHectares, farmsByState: farmsByStateFormatted, landUsage, cropsDistribution: cropsDistributionFormatted };
    }
}

