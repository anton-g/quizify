import { Game } from "../interfaces/game.interface";
import { PlayerDto } from "./player.dto";
import { GameState } from "../game.state";
import { PlaylistDto } from "../../playlist/dtos/playlist.dto";

export class GameDto {
  constructor (game: Game) {
    this.state = game.state;
    this.key = game.key;
    this.secret = game.secret;
    this.host = new HostDto(game.host);
    this.players = game.players.map(p => new PlayerDto(p));
    this.questions = game.questions;
    this.currentQuestionNo = game.currentQuestionNo;
    this.playlist = new PlaylistDto(game.playlist);
  }

  readonly state: GameState;
  readonly key: string;
  readonly secret: string;
  readonly host: HostDto;
  readonly players: PlayerDto[];
  readonly questions: string[];
  readonly currentQuestionNo: number;
  readonly playlist: PlaylistDto;
}

export class HostDto {
  constructor (host: any) {
    this.socket = host.socket;
    this.connected = host.connected;
  }

  readonly socket: string;
  readonly connected: boolean;
}
