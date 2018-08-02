import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../interfaces/user.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }

  async create(name: string, accessToken: string, refreshToken: string): Promise<User> {
    const user = new this.userModel({
      name: name,
      spotifyAccessToken: accessToken,
      spotifyRefreshToken: refreshToken
    })
    await user.save()

    return this.getById(user._id)
  }

  async get(): Promise<User[]> {
    return await this.userModel.find()
  }

  async getById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec()
  }
}
