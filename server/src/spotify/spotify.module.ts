import { Module, HttpModule } from "@nestjs/common";
import { SpotifyService } from "./spotify.service";

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
