import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { MongooseModule } from "@nestjs/mongoose";
import { GameSchema } from "./schemas/game.schema";
import { PlayerSchema } from "./schemas/player.schema";
import { PlayerService } from "./player.service";
import { GameGateway } from "./game.gateway";

@Module({
    imports: [MongooseModule.forFeature([
      { name: 'Game', schema: GameSchema },
      { name: 'Player', schema: PlayerSchema }
    ])],
    controllers: [GameController],
    components: [
      GameService,
      PlayerService,
      GameGateway
    ]
})
export class GameModule { }
