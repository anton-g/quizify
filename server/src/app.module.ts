import { Module } from '@nestjs/common'
import { GameModule } from './game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
    imports: [
      GameModule,
      PlaylistModule,
      MongooseModule.forRoot('mongodb://localhost/quizify')
    ]
})
export class ApplicationModule { }
