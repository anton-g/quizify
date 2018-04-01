import { NestFactory, NestApplication } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(cors());
	await app.listen(3000);
}
bootstrap();
