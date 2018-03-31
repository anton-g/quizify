import { Player } from "../interfaces/player.interface";

export class PlayerDto {
  constructor (player: Player) {
    this.name = player.name;
    this.score = player.score;
    this.id = player._id;
  }

  readonly name: string;
  readonly score: number;
  readonly id: string;
}
