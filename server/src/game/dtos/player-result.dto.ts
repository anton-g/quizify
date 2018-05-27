import { Player } from "../interfaces/player.interface";

export class PlayerResultDto {
  constructor(player: Player) {
    this.name = player.name;
    this.id = player._id;
    this.score = player.score;
  }

  readonly name: string;
  readonly id: string;
  readonly score: number;
}
