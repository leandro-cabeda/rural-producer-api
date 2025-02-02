import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Producer } from '../entity/producer.entity';
import { ProducerService } from '../producer.service';
import { CpfCnpjValidator } from '../../../utils/validate-cpf-cnpj';

describe('ProducerService', () => {
  let service: ProducerService;
  let repository: Repository<Producer>;

  const mockProducerRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((producer) => Promise.resolve({ id: 1, ...producer })),
    find: jest.fn().mockResolvedValue([{ id: 1, name: 'João Silva', cpfCnpj: '12345678901234' }]),
    findOne: jest.fn().mockImplementation((id) =>
      Promise.resolve(id === 1 ? { id, name: 'João Silva', cpfCnpj: '12345678901234' } : null),
    ),
    remove: jest.fn().mockResolvedValue(undefined),
  };
  const dto = { id: 1, name: 'João Silva', cpfCnpj: '12345678901234' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        { provide: getRepositoryToken(Producer), useValue: mockProducerRepository },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    repository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
  });

  it('deve criar um produtor', async () => {

    expect(CpfCnpjValidator.isValidCpfCnpj(dto.cpfCnpj)).toEqual(true);
    expect(await service.create(dto)).toEqual({ id: 1, ...dto });
    expect(mockProducerRepository.save).toHaveBeenCalled();
  });

  it('deve retornar todos os produtores', async () => {
    expect(await service.findAll()).toEqual([{ id: 1, name: 'João Silva', cpfCnpj: '12345678901234' }]);
  });

  it('deve retornar um produtor pelo ID', async () => {
    expect(await service.findOne(1)).toEqual({ id: 1, name: 'João Silva', cpfCnpj: '12345678901234' });
  });

  it('deve lançar erro ao buscar um produtor inexistente', async () => {
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('deve remover um produtor pelo ID', async () => {
    expect(await service.delete(1)).toBeUndefined();
    expect(mockProducerRepository.remove).toHaveBeenCalled();
  });
});
