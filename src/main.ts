import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';


async function bootstrap() {
  dotenv.config();
  console.log("process.env.DATABASE_URL: ", process.env.DATABASE_URL);

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const options = new DocumentBuilder()
    .setTitle('API Produtores Rurais')
    .setDescription('Esta api envolve em uma criação de um aplicativo Node.js/NestJS que fornecerá uma API para cadastrar produtores rurais e amostração das informações.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
