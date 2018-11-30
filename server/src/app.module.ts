import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CharityModule } from './charity/charity.module';

// https://github.com/nestjs/nest/issues/530
const configService = new ConfigService(`${process.env.NODE_ENV}.env`);

@Module({
    imports: [
      ConfigModule,
      AuthModule,
      GameModule,
      UserModule,
      CharityModule,
      MongooseModule.forRoot(configService.mongoDbUrl)
    ]
})
export class ApplicationModule { }
