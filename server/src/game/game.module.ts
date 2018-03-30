import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { MongooseModule } from "@nestjs/mongoose";
import { GameSchema } from "./schemas/game.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }])],
    controllers: [GameController],
    components: [GameService]
})
export class GameModule { }