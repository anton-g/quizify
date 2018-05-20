import { Game } from "../interfaces/game.interface";
import { GameState } from "../game.state";

export class PlayerGameInfoDto {
  constructor (game: Game) {
    this.playlist = 'A playlist name';
    this.questionCount = 0;
    this.state = game.state;
  }

  readonly playlist: string;
  readonly questionCount: number;
  readonly state: GameState;
}
