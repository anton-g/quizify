import { Module } from '@nestjs/common'
import { GameModule } from './game/game.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
      GameModule,
      MongooseModule.forRoot('mongodb://localhost/quizify')
    ]
})
export class ApplicationModule { }
