import * as mongoose from 'mongoose'
import { PlayerSchema } from './player.schema';
import { Schema } from 'mongoose';

export const GameSchema = new mongoose.Schema({
  state: String,
  key: String,
  secret: String,
  host: { socket: String, connected: Boolean },
  players: [PlayerSchema],
  questions: Array,
  currentQuestionNo: Number,
  playlist: { type: Schema.Types.ObjectId, ref: 'Playlist' }
});
