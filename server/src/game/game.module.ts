import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./services/game.service";
import { MongooseModule } from "@nestjs/mongoose";
import { GameSchema } from "./schemas/game.schema";
import { PlayerSchema } from "./schemas/player.schema";
import { PlayerService } from "./services/player.service";
import { PlayerGateway } from "./gateways/player.gateway";
import { HostGateway } from "./gateways/host.gateway";

@Module({
    imports: [MongooseModule.forFeature([
      { name: 'Game', schema: GameSchema },
      { name: 'Player', schema: PlayerSchema }
    ])],
    controllers: [GameController],
    providers: [
      GameService,
      PlayerService,
      PlayerGateway,
      HostGateway
    ]
})
export class GameModule { }
