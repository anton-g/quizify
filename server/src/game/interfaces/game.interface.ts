import { Player } from "./player.interface";

export interface Game {
    readonly secret: string;
    readonly key: string;
    readonly players: Player[];
}
