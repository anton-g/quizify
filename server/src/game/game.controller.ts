import { Controller, Get, Post, Param } from "@nestjs/common";
import { CreateGameDto } from "./dtos/create-game.dto";
import { GameService } from "./game.service";

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post()
    async create (): Promise<CreateGameDto> {
        const game = await this.gameService.create()
        return await game
    }

    @Get(':key/exists')
    async exist (@Param() params): Promise<boolean> {
        const game = await this.gameService.get(params.key)
        return !!(game)
    }
}