import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../interfaces/user.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }

  async create(id: string, accessToken: string, refreshToken: string): Promise<User> {
    // Remove users previous data to ensure tokens are newest, we should probably update it in the future
    await this.userModel.remove({
      '_id': id
    }).exec()

    const user = new this.userModel({
      _id: id,
      spotifyAccessToken: accessToken,
      spotifyRefreshToken: refreshToken,
      hueAccessToken: null,
      hueRefreshToken: null,
      hueUsername: null
    })
    await user.save()

    return this.getById(user._id)
  }

  async updateAccessToken(id: string, accessToken: string): Promise<User> {
    return await this.userModel.findOneAndUpdate({
      '_id': id
    }, {
      spotifyAccessToken: accessToken
    }, { new: true }).exec()
  }

  async setHueInfo(id: string, accessToken: string, refreshToken: string, username: string): Promise<User> {
    return await this.userModel.findOneAndUpdate({
      '_id': id
    }, {
      hueAccessToken: accessToken,
      hueRefreshToken: refreshToken,
      hueUsername: username
    }, { new: true }).exec()
  }

  async get(): Promise<User[]> {
    return await this.userModel.find()
  }

  async getById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec()
  }

  async getByAccessToken(token: string): Promise<User> {
    return await this.userModel.findOne({
      spotifyAccessToken: token
    })
  }
}
