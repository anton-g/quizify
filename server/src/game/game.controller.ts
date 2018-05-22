import { Controller, Get, Post, Param, HttpCode, Body, HttpException, HttpStatus, UseFilters } from "@nestjs/common";
import { GameService } from "./services/game.service";
import { Game } from "./interfaces/game.interface";
import { JoinGameDto } from "./dtos/join-game.dto";
import { GameDto } from "./dtos/game.dto";
import { PlayerDto } from "./dtos/player.dto";
import { UserExceptionFilter } from "../common/user-exception.filter";
import { JoinedGameDto } from "./dtos/joined-game.dto";
import { PlayerGameInfoDto } from "./dtos/player-game-info.dto";

@Controller('game')
@UseFilters(new UserExceptionFilter())
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @HttpCode(201)
    @Post()
    async create (): Promise<GameDto> {
      const game: Game = await this.gameService.create()
      return new GameDto(game)
    }

    @HttpCode(200)
    @Post(':key/join')
    async join (@Body() joinGameDto: JoinGameDto, @Param() params): Promise<JoinedGameDto> {
      const player = await this.gameService.join(params.key, joinGameDto)
      if (!player) throw new HttpException('Not found', HttpStatus.NOT_FOUND)

      const game = await this.gameService.getByPlayerId(player.id)
      if (!game) throw new HttpException('Not found', HttpStatus.NOT_FOUND)

      return new JoinedGameDto(player, game)
    }

    @HttpCode(200)
    @Get(':key')
    async get (@Param() params): Promise<GameDto> {
      const game = await this.gameService.get(params.key)
      if (!game) throw new HttpException('Not found', HttpStatus.NOT_FOUND)

      return new GameDto(game)
    }

    @HttpCode(200)
    @Get(':key/exists')
    async exist (@Param() params): Promise<boolean> {
        const game = await this.gameService.get(params.key)
        return !!(game)
    }
}
