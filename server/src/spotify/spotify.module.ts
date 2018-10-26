import { Module, HttpModule, forwardRef } from "@nestjs/common";
import { SpotifyService } from "./spotify.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
      HttpModule,
      forwardRef(() => UserModule)
    ],
    providers: [
      SpotifyService
    ],
    exports: [
      SpotifyService
    ]
})
export class SpotifyModule { }
