import { Module } from '@nestjs/common'
import { UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services/user.service';

@Module({
    imports: [MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ])],
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
