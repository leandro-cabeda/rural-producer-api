import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Farm } from '../../farm/entity/farm.entity';
import { IsCpfCnpj } from '../../../validators/cpf-cnpj.validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

@Entity()
@ApiTags('producer')
export class Producer {

  @ApiProperty({ example: 1, type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '123.456.789-00', type: String })
  @IsCpfCnpj({ message: 'CPF ou CNPJ inválido' })
  @IsNotEmpty()
  @Column({ unique: true })
  cpfCnpj: string;

  @ApiProperty({ example: 'João da Silva', type: String })
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({
    example: '02/02/2022 12:00:00',
    type: Date,
  })
  @IsDate()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  createdAt?: Date;

  @ApiProperty({
    example: '02/02/2022 12:00:00',
    type: Date,
  })
  @IsDate()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt?: Date;

  @OneToMany(() => Farm, (farm) => farm.producer, { cascade: true, onDelete: 'CASCADE' })
  farms?: Farm[];
}
