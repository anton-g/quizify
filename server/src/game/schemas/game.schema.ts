import * as mongoose from 'mongoose'
import { PlayerSchema } from './player.schema';

export const GameSchema = new mongoose.Schema({
    key: String,
    secret: String,
    players: [PlayerSchema]
});
