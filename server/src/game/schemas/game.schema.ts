import * as mongoose from 'mongoose'
import { PlayerSchema } from './player.schema';

export const GameSchema = new mongoose.Schema({
  state: String,
  key: String,
  secret: String,
  host: {
    socket: String,
    connected: Boolean,
    user: { type: mongoose.Schema.Types.String, ref: 'User' }
  },
  players: [PlayerSchema],
  questions: Array,
  currentQuestionNo: Number,
  playlistId: String,
  playlist: { type: mongoose.Schema.Types.String, ref: 'Playlist' }
});
