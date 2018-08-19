import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Playlist } from "../interfaces/playlist.interface";
import * as i18n from 'i18n';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel('Playlist') private readonly playlistModel: Model<Playlist>,
  ) { }

  async create(spotifyPlaylist: any, locale: string): Promise<Playlist> {
    return await this.playlistModel.findOneAndUpdate({
      '_id': spotifyPlaylist.id
    }, {
      _id: spotifyPlaylist.id,
      name: spotifyPlaylist.name,
      description: spotifyPlaylist.description,
      img: spotifyPlaylist.images[0].url,
      tracks: spotifyPlaylist.tracks.items.map(t => {
        return {
          _id: t.track.id,
          uri: t.track.uri,
          name: t.track.name,
          imageUrl: t.track.album.images[0].url,
          artist: t.track.artists.reduce((sum, artist, idx) => {
            if (idx < 1) return artist.name
            return `${sum}, ${artist.name}`
          }, ''),
          question: Math.random() > 0.49 ? i18n.__({ phrase: 'question:artist', locale: locale }) : i18n.__({ phrase: 'question:track', locale: locale })
        }
      })
    }, {
      upsert: true,
      new: true
    }).exec()
  }

  async get(): Promise<Playlist[]> {
    return await this.playlistModel.find()
  }

  async getById(id: string): Promise<Playlist> {
    return await this.playlistModel.findById(id).exec()
  }

  async getFeatured(): Promise<Playlist[]> {
    return await this.playlistModel.find({
      "featured": true
    }).exec()
  }
}
