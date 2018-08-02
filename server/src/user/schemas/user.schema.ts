import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
    name: String,
    spotifyAccessToken: String,
    spotifyRefreshToken: String
});
