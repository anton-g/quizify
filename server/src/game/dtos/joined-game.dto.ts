import { PlayerDto } from "./player.dto";
import { PlayerGameInfoDto } from "./player-game-info.dto";
import { Player } from "../interfaces/player.interface";
import { Game } from "../interfaces/game.interface";

export class JoinedGameDto {
  constructor (player: Player, game: Game) {
    this.player = new PlayerDto(player);
    this.game = new PlayerGameInfoDto(game);
  }

  readonly player: PlayerDto;
  readonly game: PlayerGameInfoDto;
}
