import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
    _id: String,
    spotifyAccessToken: String,
    spotifyRefreshToken: String
});
