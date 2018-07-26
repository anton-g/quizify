import * as mongoose from 'mongoose'
import { PlayerSchema } from './player.schema';

export const GameSchema = new mongoose.Schema({
  state: String,
  key: String,
  secret: String,
  hostSocket: String,
  players: [PlayerSchema],
  questions: Array,
  currentQuestionNo: Number
});
