import { Model } from 'mongoose';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Game } from '../interfaces/game.interface';
import { Player } from '../interfaces/player.interface';
import * as mongoose from "mongoose";
import { UserException } from '../../common/user.exception';
import { GameState } from '../game.state';
import { Playlist } from '../../playlist/interfaces/playlist.interface';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel('Game') private readonly gameModel: Model<Game>,
    @InjectModel('Playlist') private readonly playlistModel: Model<Playlist>
  ) { }

  async find(playerId: string): Promise<Player> {
    const games: Game[] = await this.gameModel.find(
      { "players._id": playerId }
    ).exec()

    if (!games || !games[0] || !games[0].players) return Promise.reject(new UserException(`Can't find player with id ${playerId}`))

    return games[0].players.find(p => p._id.toString() == playerId)
  }

  async score(playerId: string, score: number): Promise<Player> {
    if (!mongoose.Types.ObjectId.isValid(playerId)) return Promise.reject(new UserException('Invalid playerId'))

    const result: Game = await this._findOneGameAndUpdate(
      { "players._id": playerId },
      { $inc: { "players.$.score": score } }
    )

    return result.players.find(p => p._id == playerId)
  }

  async connect(playerId: string, socketId: string): Promise<Game> {
    if (!socketId) return Promise.reject(new UserException('Missing socketId'))
    if (!mongoose.Types.ObjectId.isValid(playerId)) return Promise.reject(new UserException('Invalid playerId'))

    return await this._findOneGameAndUpdate(
      { "players._id": playerId },
      { $set: {
        "players.$.socketId": socketId,
        "players.$.connected": true
      } }
    )
  }

  async disconnect(playerSocketId: string): Promise<Game> {
    if (!playerSocketId) return Promise.reject(new UserException('Invalid socket id'))

    const result: Game = await this._findOneGameAndUpdate(
      { "players.socketId": playerSocketId },
      { $set: { "players.$.connected": false } }
    )

    return result
  }

  async reconnect(oldSocketId: string, newSocketId: string): Promise<Game> {
    if (!oldSocketId) return Promise.reject(new UserException('Invalid old socket id'))
    if (!newSocketId) return Promise.reject(new UserException('Invalid new socket id'))

    const result: Game = await this._findOneGameAndUpdate(
      {
        "players.socketId": oldSocketId,
        "state": { $ne: GameState.Ended }
      },
      { $set: {
        "players.$.socketId": newSocketId,
        "players.$.connected": true
      } }
    )

    return result
  }

  async _findOneGameAndUpdate(conditions, update) {
    return await this.gameModel
                    .findOneAndUpdate(
                      conditions,
                      update,
                    { new: true })
                    .populate({
                      path: 'playlist',
                      model: this.playlistModel
                    })
                    .exec()
  }
}
