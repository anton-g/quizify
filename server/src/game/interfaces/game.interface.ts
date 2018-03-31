import { Player } from "./player.interface";

export interface Game {
    readonly secret: string;
    readonly key: string;
    readonly hostSocket: string;
    readonly players: Player[];
}
