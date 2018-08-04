import { Document } from 'mongoose';
import { Track } from './track.interface';

export interface Playlist extends Document {
  readonly _id: string;
  readonly name: string;
  readonly description: string;
  readonly length: number;
  readonly tracks: Track[];
  readonly img: string;
  readonly color: string;
  readonly featured: boolean;
}
