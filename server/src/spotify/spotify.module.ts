import { Module, HttpModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SpotifyService } from "../spotify/spotify.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
      HttpModule
    ],
    providers: [
      SpotifyService
    ],
    exports: [
      SpotifyService
    ]
})
export class SpotifyModule { }
