import * as mongoose from 'mongoose'

export const GameSchema = new mongoose.Schema({
    key: String,
    players: Array
});