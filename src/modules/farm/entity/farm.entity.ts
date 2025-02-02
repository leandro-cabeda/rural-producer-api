import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Producer } from '../../producer/entity/producer.entity';
import { Crop } from '../../../modules/crop/entity/crop.entity';
import { ApiTags, ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Harvest } from '../../../modules/harvest/entity/harvest.entity';

@Entity()
@ApiTags('farm')
export class Farm {

  @ApiProperty({ example: 1, type: Number })
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({ example: 'Fazenda do João', type: String })
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({ example: 'São Paulo', type: String })
  @IsNotEmpty()
  @Column()
  city: string;

  @ApiProperty({ example: 'SP', type: String })
  @IsNotEmpty()
  @Column()
  state: string;

  @ApiProperty({ example: 10, type: Number })
  @IsNumber()
  @Min(0, { message: 'A área total deve ser um número positivo.' })
  @Column('decimal')
  totalArea: number; // total area in hectares

  @ApiProperty({ example: 5, type: Number })
  @IsNumber()
  @Min(0, { message: 'A área agricultável deve ser um número positivo.' })
  @Column('decimal')
  arableArea: number; // arable area in hectares (agricultural land)

  @ApiProperty({ example: 5, type: Number })
  @IsNumber()
  @Min(0, { message: 'A área de vegetação deve ser um número positivo.' })
  @Column('decimal')
  vegetationArea: number; // vegetation area in hectares

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

  @ApiProperty({ example: 1, type: Number })
  @ManyToOne(() => Producer, (producer) => producer.farms)
  @JoinColumn({ name: 'producer_id' })
  producer?: Producer;

  @OneToMany(() => Crop, (crop) => crop.farm, { cascade: true, onDelete: 'CASCADE' })
  crops?: Crop[];

  @OneToMany(() => Harvest, (harvest) => harvest.farm, { cascade: true, onDelete: 'CASCADE' })
  harvests: Harvest[];
}
