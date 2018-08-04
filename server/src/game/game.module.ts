import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./services/game.service";
import { MongooseModule } from "@nestjs/mongoose";
import { GameSchema } from "./schemas/game.schema";
import { PlayerSchema } from "./schemas/player.schema";
import { PlayerService } from "./services/player.service";
import { PlayerGateway } from "./gateways/player.gateway";
import { CommonGateway } from "./gateways/common.gateway";
import { HostGateway } from "./gateways/host.gateway";
import { SpotifyModule } from "../spotify/spotify.module";
import { UserModule } from "../user/user.module";
import { PlaylistModule } from "../playlist/playlist.module";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Game', schema: GameSchema },
        { name: 'Player', schema: PlayerSchema }
      ]),
      SpotifyModule,
      UserModule,
      PlaylistModule
    ],
    controllers: [
      GameController
    ],
    providers: [
      GameService,
      PlayerService,
      CommonGateway,
      PlayerGateway,
      HostGateway
    ]
})
export class GameModule { }
