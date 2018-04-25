import { Model } from 'mongoose';
import { Component } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GameSchema } from '../schemas/game.schema';
import { Game } from '../interfaces/game.interface';
import { Player } from '../interfaces/player.interface';
import * as mongoose from "mongoose";
import { UserException } from '../../common/user.exception';

@Component()
export class PlayerService {
  constructor(
    @InjectModel(GameSchema) private readonly gameModel: Model<Game>
  ) { }

  async score(playerId: string, score: number): Promise<Player> {
    if (!mongoose.Types.ObjectId.isValid(playerId)) return Promise.reject(new UserException('Invalid playerId'))

    const result: Game = await this.gameModel.findOneAndUpdate(
      { "players._id": playerId },
      { $inc: { "players.$.score": score } }
    ).exec()

    return result.players.find(p => p._id == playerId)
  }

  async connect(playerId: string, socketId: string): Promise<Game> {
    if (!socketId) return Promise.reject({ error: 'Missing socketId' })
    if (!mongoose.Types.ObjectId.isValid(playerId)) return Promise.reject(new UserException('Invalid playerId'))

    return await this.gameModel.findOneAndUpdate(
      { "players._id": playerId },
      { $set: {
        "players.$.socketId": socketId,
        "players.$.connected": true
      } },
      { new: true }
    ).exec()
  }

  async disconnect(playerSocketId: string) {
    return await this.gameModel.findOneAndUpdate(
      { "players.socketId": playerSocketId },
      { $set: { "players.$.connected": false } },
      { new: true }
    ).exec()
  }

  async reconnect(oldSocketId: string, newSocketId: string) {
    return await this.gameModel.findOneAndUpdate(
      { "players.socketId": oldSocketId },
      { $set: { "players.$.socketId": newSocketId } },
      { new: true }
    ).exec()
  }
}
