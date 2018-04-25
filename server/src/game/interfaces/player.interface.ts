export interface Player {
  readonly name: string;
  readonly score: number;
  readonly _id: string;
  readonly socketId: string;
  readonly connected: boolean;
}
