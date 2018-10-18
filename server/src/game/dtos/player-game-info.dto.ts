import { Game } from "../interfaces/game.interface";
import { GameState } from "../game.state";
import { Player } from "../interfaces/player.interface";

export class PlayerGameInfoDto {
  constructor (game: Game) {
    this.playlist = game.playlist.name;
    this.questionCount = game.playlist.tracks.length;
    this.currentQuestionNo = game.currentQuestionNo;
    this.state = game.state;
    this.players = game.players;
  }

  readonly playlist: string;
  readonly questionCount: number;
  readonly currentQuestionNo: number;
  readonly state: GameState;
  readonly players: Player[];
}
