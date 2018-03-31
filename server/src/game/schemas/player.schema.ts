import * as mongoose from 'mongoose'

export const PlayerSchema = new mongoose.Schema({
    name: String,
    score: Number,
    socketId: String
});
