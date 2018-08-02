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
import { PlaylistSchema } from "./schemas/playlist.schema";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./services/playlist.service";
import { SpotifyModule } from "../spotify/spotify.module";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Game', schema: GameSchema },
        { name: 'Player', schema: PlayerSchema },
        { name: 'Playlist', schema: PlaylistSchema }
      ]),
      SpotifyModule
    ],
    controllers: [
      GameController,
      PlaylistController
    ],
    providers: [
      GameService,
      PlayerService,
      PlaylistService,
      CommonGateway,
      PlayerGateway,
      HostGateway
    ]
})
export class GameModule { }
