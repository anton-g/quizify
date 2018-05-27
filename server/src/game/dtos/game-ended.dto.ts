import { PlayerResultDto } from "./player-result.dto";
import { Game } from "../interfaces/game.interface";

export class GameEndedDto {
  constructor(game: Game) {
    this.results = game.players.map(p => new PlayerResultDto(p))
  }

  readonly results: PlayerResultDto[];
}
