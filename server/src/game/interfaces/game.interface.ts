import { Player } from "./player.interface";
import { GameState } from "../game.state";
import { Document } from 'mongoose';
import { Playlist } from "../../playlist/interfaces/playlist.interface";
import { User } from "../../user/interfaces/user.interface";

export interface Game extends Document {
  readonly state: GameState;
  readonly secret: string;
  readonly key: string;
  readonly host: Host;
  readonly players: Player[];
  readonly currentQuestionNo: number;
  readonly activeTrackIdx: number;
  readonly deviceId: string;
  playlist: Playlist;
}

export interface Host extends Document {
  readonly socket: string;
  readonly connected: boolean;
  readonly user: User;
}
