import { PlayerDto } from "./player.dto";
import { PlayerGameInfoDto } from "./player-game-info.dto";

export class JoinedGameDto {
  readonly player: PlayerDto;
  readonly game: PlayerGameInfoDto;
}
