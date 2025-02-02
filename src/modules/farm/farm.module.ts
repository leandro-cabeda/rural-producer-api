import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from '../producer/entity/producer.entity';
import { Farm } from './entity/farm.entity';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';


import { Module } from '@nestjs/common';
import { CustomLogger } from 'src/logger/logger.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Producer, Farm]),
    ],
    controllers: [
        FarmController, ],
    providers: [
        FarmService, CustomLogger ],
})
export class FarmModule { }
