import { Document } from 'mongoose';

export interface User extends Document {
  readonly _id: string;
  readonly spotifyAccessToken: string;
  readonly spotifyRefreshToken: string;
}
