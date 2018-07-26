import { Game } from "../interfaces/game.interface";
import { PlayerDto } from "./player.dto";
import { GameState } from "../game.state";

export class GameDto {
  constructor (game: Game) {
    this.state = game.state;
    this.key = game.key;
    this.secret = game.secret;
    this.host = new HostDto(game.host);
    this.players = game.players.map(p => new PlayerDto(p));
    this.questions = game.questions;
    this.currentQuestionNo = game.currentQuestionNo;
  }

  readonly state: GameState;
  readonly key: string;
  readonly secret: string;
  readonly host: HostDto;
  readonly players: PlayerDto[];
  readonly questions: string[];
  readonly currentQuestionNo: number;
}

export class HostDto {
  constructor (host: any) {
    this.socket = host.socket;
    this.connected = host.connected;
  }

  readonly socket: string;
  readonly connected: boolean;
}
