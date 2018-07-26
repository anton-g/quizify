import { Player } from "./player.interface";
import { GameState } from "../game.state";
import { Document } from 'mongoose';

export interface Game extends Document {
  readonly state: GameState;
  readonly secret: string;
  readonly key: string;
  readonly host: Host;
  readonly players: Player[];
  readonly questions: string[];
  readonly currentQuestionNo: number;
}

export interface Host extends Document {
  readonly socket: string;
  readonly connected: boolean;
}
