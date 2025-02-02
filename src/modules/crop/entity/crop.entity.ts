import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Farm } from '../../../modules/farm/entity/farm.entity';
import { Harvest } from '../../../modules/harvest/entity/harvest.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
@ApiTags('Crop')
export class Crop {

  @ApiProperty({ example: 1, type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Milho', type: String })
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({ example: 2020, type: Number })
  @IsNumber()
  @Column()
  year: number;

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
  @ManyToOne(() => Farm, (farm) => farm.crops)
  @JoinColumn({ name: 'farm_id' })
  farm?: Farm;

  @ApiProperty({ example: 1, type: Number })
  @ManyToOne(() => Harvest, (harvest) => harvest.crops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'harvest_id' })
  harvest?: Harvest;
}
