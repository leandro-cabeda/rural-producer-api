import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNumber, IsDate } from 'class-validator';
import { Crop } from '../../../modules/crop/entity/crop.entity';
import { Farm } from '../../../modules/farm/entity/farm.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
@ApiTags('harvest')
export class Harvest {

  @ApiProperty({ example: 1, type: Number })
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => Crop, (crop) => crop.harvest, { cascade: true, onDelete: 'CASCADE' })
  crops?: Crop[];

  @ApiProperty({ example: 1, type: Number })
  @ManyToOne(() => Farm, (farm) => farm.harvests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm?: Farm;
}
