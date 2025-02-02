import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from './entity/producer.entity';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';


import { Module } from '@nestjs/common';
import { CustomLogger } from 'src/logger/logger.service';

@Module({
    imports: [
       TypeOrmModule.forFeature([Producer]),
    ],
    controllers: [
        ProducerController,],
    providers: [
        ProducerService, CustomLogger],
})
export class ProducerModule { }
