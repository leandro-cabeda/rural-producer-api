import { FarmModule } from './modules/farm/farm.module';
import { ProducerModule } from './modules/producer/producer.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    FarmModule, 
    ProducerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1', // configuraçao do banco para rodar local na maquina
      //host: 'db', // configuraçao do banco para rodar api no docker como um container e conectando no banco postgres em outro container
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'rural_producer',
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
