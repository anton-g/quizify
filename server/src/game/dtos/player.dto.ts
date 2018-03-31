import { Player } from "../interfaces/player.interface";

export class PlayerDto {
  constructor (player: Player) {
    this.name = player.name;
    this.score = player.score;
  }

  readonly name: string;
  readonly score: number;
}
