import * as mongoose from 'mongoose'

export const TrackSchema = new mongoose.Schema({
  _id: String,
  name: String,
  imageUrl: String,
  artist: String,
  question: String
});
