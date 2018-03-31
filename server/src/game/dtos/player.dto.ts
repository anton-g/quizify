import { Player } from "../interfaces/player.interface";

export class PlayerDto {
  constructor (player: Player) {
    this.name = player.name;
    this.score = player.score;
    this.id = player._id;
    this.socketId = player.socketId;
  }

  readonly name: string;
  readonly score: number;
  readonly id: string;
  readonly socketId: string;
}
