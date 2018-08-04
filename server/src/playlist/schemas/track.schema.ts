import * as mongoose from 'mongoose'

export const TrackSchema = new mongoose.Schema({
  _id: String,
  uri: String,
  name: String,
  imageUrl: String,
  artist: String,
  question: String
});
