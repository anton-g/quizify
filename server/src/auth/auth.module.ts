import { Module, HttpModule } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "../common/jwt.strategy";
import { SpotifyModule } from "../spotify/spotify.module";
import { HueModule } from "../hue/hue.module";

@Module({
    imports: [
      MongooseModule.forFeature([]),
      HttpModule,
      UserModule,
      SpotifyModule,
      HueModule
    ],
    controllers: [
      AuthController
    ],
    providers: [
      AuthService,
      JwtStrategy
    ]
})
export class AuthModule { }
