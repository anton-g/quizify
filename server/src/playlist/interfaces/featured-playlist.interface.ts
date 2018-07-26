import { Document } from 'mongoose';

export interface FeaturedPlaylist extends Document {
  readonly _id: string;
  readonly name: string;
  readonly description: string;
  readonly length: number;
  readonly img: string;
  readonly color: string;
}
