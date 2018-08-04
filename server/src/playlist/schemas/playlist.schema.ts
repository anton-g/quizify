import * as mongoose from 'mongoose'
import { TrackSchema } from './track.schema';

export const PlaylistSchema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  tracks: [TrackSchema],
  img: String,
  color: String,
  featured: Boolean
});
