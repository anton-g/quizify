import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FeaturedPlaylist } from "../interfaces/featured-playlist.interface";

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel('FeaturedPlaylist') private readonly featuredPlaylistModel: Model<FeaturedPlaylist>,
  ) { }

  async get(): Promise<FeaturedPlaylist[]> {
    return await this.featuredPlaylistModel.find()
  }

  async getById(id: string): Promise<FeaturedPlaylist> {
    return await this.featuredPlaylistModel.findById(id).exec()
  }
}
