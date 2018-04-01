import { Player } from "./player.interface";
import { GameState } from "../game.state";

export interface Game {
  readonly state: GameState;
  readonly secret: string;
  readonly key: string;
  readonly hostSocket: string;
  readonly players: Player[];
}
