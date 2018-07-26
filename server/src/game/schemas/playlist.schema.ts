import * as mongoose from 'mongoose'

export const PlaylistSchema = new mongoose.Schema({
  name: String,
  description: String,
  length: Number,
  img: String,
  color: String,
  featured: Boolean
});
