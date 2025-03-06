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
      url: "postgresql://postgres:pJzbcWDmUBcRIYEbDwiAxuqeWnktDMoz@tramway.proxy.rlwy.net:20601/railway", // variavel de ambiente para conexão com o banco online na plataforma railway
      //host: "dpg-cufmfma3esus73e2a54g-a", // host do banco online na plataforma Render
      //host: '127.0.0.1', // configuraçao do banco para rodar local na maquina
      //host: 'db', // configuraçao do banco para rodar api no docker como um container e conectando no banco postgres em outro container
      //port: 5432,
      //username: 'admin',
      //password: 'admin', // senha do banco local e também do banco do docker criado
      //password: 'y0Ed5Ext6xjipQzhfnYIpeuvAfpIRZGX', // senha do banco online na plataforma Render
      //database: 'rural_producer',
      autoLoadEntities: true,
      synchronize: false, // false se estiver em produção, para teste em desenvolvimento deixe true
      entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
      ssl: {
        rejectUnauthorized: false, // ⚠️ Importante para conexão externa no Railway
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
