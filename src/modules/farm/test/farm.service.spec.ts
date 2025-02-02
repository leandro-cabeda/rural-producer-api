import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Producer } from '../../../modules/producer/entity/producer.entity';
import { Farm } from '../entity/farm.entity';
import { FarmService } from '../farm.service';

describe('FarmService', () => {
  let service: FarmService;
  let farmRepository: Repository<Farm>;
  let producerRepository: Repository<Producer>;

  const mockFarmRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((farm) => Promise.resolve({ id: 1, ...farm })),
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockImplementation((id) => Promise.resolve(id === 1 ? { id, name: 'Test Farm' } : null)),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  const mockProducerRepository = {
    findOne: jest.fn().mockImplementation((id) => Promise.resolve(id === 1 ? { id, name: 'Test Producer' } : null)),
  };

  const dto = {
    id: 1,
    name: 'Test Farm',
    city: 'City',
    state: 'State',
    totalArea: 100,
    arableArea: 50,
    vegetationArea: 50,
    producer: {
      id: 1,
      name: 'Test Producer',
      cpfCnpj: '123.456.789-00',
    },
    crops: [],
    harvests: [],
  };

  function validateFarmAreas(data: Farm) {
    const { totalArea, arableArea, vegetationArea } = data;

    if (totalArea !== undefined && arableArea !== undefined && vegetationArea !== undefined) {
      if (arableArea + vegetationArea > totalArea) {
        throw new BadRequestException(
          'A soma das áreas agricultável e de vegetação não pode ultrapassar a área total da fazenda.',
        );
      }
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        { provide: getRepositoryToken(Farm), useValue: mockFarmRepository },
        { provide: getRepositoryToken(Producer), useValue: mockProducerRepository },
      ],
    }).compile();

    service = module.get<FarmService>(FarmService);
    farmRepository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
    producerRepository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
  });

  it('deve criar uma fazenda', async () => {

    expect(validateFarmAreas(dto)).toEqual(undefined);
    expect(await service.create(dto)).toEqual({ id: 1, ...dto });
    expect(mockFarmRepository.save).toHaveBeenCalled();
  });

  it('deve lançar erro ao tentar criar fazenda sem produtor válido', async () => {
    await expect(service.create({ ...dto, producer: null })).rejects.toThrow(NotFoundException);
  });

  it('deve listar todas as fazendas', async () => {
    expect(await service.findAll()).toEqual([]);
  });

  it('deve retornar uma fazenda existente', async () => {
    expect(await service.findOne(1)).toEqual({ id: 1, name: 'Test Farm' });
  });

  it('deve lançar erro ao buscar uma fazenda inexistente', async () => {
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });
});
