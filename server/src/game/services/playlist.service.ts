import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Playlist } from "../interfaces/playlist.interface";

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel('Playlist') private readonly PlaylistModel: Model<Playlist>,
  ) { }

  async get(): Promise<Playlist[]> {
    return await this.PlaylistModel.find()
  }

  async getById(id: string): Promise<Playlist> {
    return await this.PlaylistModel.findById(id).exec()
  }
}
