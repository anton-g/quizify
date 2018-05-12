import { Game } from "../interfaces/game.interface";

export class PlayerGameInfoDto {
  constructor (game: Game) {
    this.playlist = 'A playlist name';
    this.questionCount = 0;
  }

  readonly playlist: string;
  readonly questionCount: number;
}
