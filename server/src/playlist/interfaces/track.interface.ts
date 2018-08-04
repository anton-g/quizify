import { Document } from 'mongoose';

export interface Track extends Document {
  readonly _id: string;
  readonly uri: string;
  readonly name: string;
  readonly imageUrl: string;
  readonly artist: string;
  readonly question: string;
}
