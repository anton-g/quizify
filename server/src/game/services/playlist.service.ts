import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Playlist } from "../interfaces/playlist.interface";

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel('Playlist') private readonly playlistModel: Model<Playlist>,
  ) { }

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
