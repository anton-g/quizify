import { Module, HttpModule } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { SpotifyService } from "../common/spotify.service";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "../common/jwt.strategy";

@Module({
    imports: [
      MongooseModule.forFeature([]),
      HttpModule,
      UserModule
    ],
    controllers: [
      AuthController
    ],
    providers: [
      SpotifyService,
      AuthService,
      JwtStrategy
    ]
})
export class AuthModule { }
