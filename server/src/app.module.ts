import { Module } from '@nestjs/common'
import { GameModule } from './game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';

@Module({
    imports: [
      ConfigModule,
      GameModule,
      UserModule,
      MongooseModule.forRoot('mongodb://localhost/quizify')
    ]
})
export class ApplicationModule { }
