import { NestFactory, NestApplication } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as i18n from 'i18n';
import * as cors from 'cors';

async function bootstrap() {
  i18n.configure({
    locales:['en', 'sv'],
    directory: __dirname + '/locales'
  });

  const app = await NestFactory.create(ApplicationModule);
  app.use(i18n.init)
  app.use(cors());
	await app.listen(3000);
}
bootstrap();
