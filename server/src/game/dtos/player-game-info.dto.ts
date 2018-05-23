import { Game } from "../interfaces/game.interface";
import { GameState } from "../game.state";

export class PlayerGameInfoDto {
  constructor (game: Game) {
    this.playlist = 'A playlist name';
    this.questionCount = game.questions.length;
    this.currentQuestion = game.currentQuestion;
    this.state = game.state;
  }

  readonly playlist: string;
  readonly questionCount: number;
  readonly currentQuestion: number;
  readonly state: GameState;
}
