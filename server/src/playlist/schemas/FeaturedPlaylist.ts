import * as mongoose from 'mongoose'

export const FeaturedPlaylistSchema = new mongoose.Schema({
  name: String,
  description: String,
  length: Number,
  img: String,
  color: String
});
