import { Document } from 'mongoose';

export interface Playlist extends Document {
  readonly _id: string;
  readonly name: string;
  readonly description: string;
  readonly length: number;
  readonly img: string;
  readonly color: string;
  readonly featured: boolean;
}
