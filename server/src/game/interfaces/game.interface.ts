import { Player } from "./player.interface";
import { GameState } from "../game.state";
import { Document } from 'mongoose';

export interface Game extends Document {
  readonly state: GameState;
  readonly secret: string;
  readonly key: string;
  readonly hostSocket: string;
  readonly players: Player[];
  readonly questions: string[];
  readonly currentQuestion: number;
}
