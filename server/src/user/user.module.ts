import { Module } from '@nestjs/common'
import { UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { SpotifyModule } from '../spotify/spotify.module';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'User', schema: UserSchema }
      ]),
      SpotifyModule
    ],
    controllers: [
      UserController
    ],
    providers: [
      UserService
    ],
    exports: [
      UserService,
      MongooseModule.forFeature([
        { name: 'User', schema: UserSchema }
      ])
    ]
})
export class UserModule { }
