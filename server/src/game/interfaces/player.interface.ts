import { Document } from 'mongoose';

export interface Player extends Document {
  readonly name: string;
  readonly score: number;
  readonly _id: string;
  readonly socketId: string;
  readonly connected: boolean;
}
