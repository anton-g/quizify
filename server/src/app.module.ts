import { Module } from '@nestjs/common'
import { GameModule } from './game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
    imports: [
      GameModule,
      UserModule,
      MongooseModule.forRoot('mongodb://localhost/quizify')
    ]
})
export class ApplicationModule { }
