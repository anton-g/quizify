import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { ConfigService } from './config/config.service';
import * as i18n from 'i18n';
import * as cors from 'cors';
import * as Sentry from '@sentry/node';
import { join } from 'path';

const configService = new ConfigService(`${process.env.NODE_ENV}.env`)
if (configService.sentryDsn) {
  Sentry.init({ dsn: configService.sentryDsn });
}

async function bootstrap() {
  i18n.configure({
    locales:['en', 'sv'],
    directory: __dirname + '/locales'
  });

  const app = await NestFactory.create(ApplicationModule);
  app.use(i18n.init)
  app.use(cors());
  app.useStaticAssets(join(__dirname, '..', 'public'));

	await app.listen(3000);
}
bootstrap();
