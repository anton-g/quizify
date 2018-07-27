import { Game } from "../interfaces/game.interface";
import { GameState } from "../game.state";

export class PlayerGameInfoDto {
  constructor (game: Game) {
    this.playlist = game.playlist.name;
    this.questionCount = game.questions.length;
    this.currentQuestionNo = game.currentQuestionNo;
    this.state = game.state;
  }

  readonly playlist: string;
  readonly questionCount: number;
  readonly currentQuestionNo: number;
  readonly state: GameState;
}
