import { Model } from 'mongoose';
import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { GameSchema } from '../schemas/game.schema';
import { Game } from '../interfaces/game.interface';
import * as nanoid from 'nanoid';
import * as generate from 'nanoid/generate';
import { JoinGameDto } from '../dtos/join-game.dto';
import { PlayerSchema } from '../schemas/player.schema';
import { Player } from '../interfaces/player.interface';
import { GameState } from '../game.state';
import { UserException } from '../../common/user.exception';

@Injectable()
export class GameService {
  constructor(
    @InjectModel('Game') private readonly gameModel: Model<Game>,
    @InjectModel('Player') private readonly playerModel: Model<Player>
  ) { }

  async create(): Promise<Game> {
    const secret: string = nanoid()
    const key: string = generate('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6)

    const questions = [
      'This is a question?',
      'Is this a question',
      'Is this real life'
    ]

    const game = new this.gameModel({
      state: GameState.Created,
      secret: secret,
      key: key,
      hostSocket: undefined,
      questions: questions,
      currentQuestion: 1
    })
    return await game.save()
  }

  async setState(key: string, state: GameState): Promise<Game> {
    if (!key) return Promise.reject(new UserException('Missing key'))

    return await this.gameModel.findOneAndUpdate(
      { "key": key },
      { $set: { "state": state } },
      { new: true }
    ).exec()
  }

  async setHost(key: string, secret: string, hostSocket: string): Promise<Game> {
    if (!key) return Promise.reject(new UserException('Missing key'))
    if (!secret) return Promise.reject(new UserException('Missing secret'))
    if (!hostSocket) return Promise.reject(new UserException('Missing hostSocket'))

    return await this.gameModel.findOneAndUpdate(
      { "key": key, "secret": secret },
      { $set: { "hostSocket": hostSocket } },
      { new: true }
    ).exec()
  }

  async join(key: string, joinGameDto: JoinGameDto): Promise<Player> {
    const game = await this.get(key)
    if (!game) return Promise.reject(new UserException('Invalid key'))
    if (game.state !== GameState.Lobby) return Promise.reject(new UserException('Invalid game state'))
    if (!joinGameDto.name) return Promise.reject(new UserException('Missing name'))

    const player = new this.playerModel({
      name: joinGameDto.name,
      score: 0,
      socketId: undefined
    })
    game.players.push(player)

    await new this.gameModel(game).save()

    return player
  }

  async get(key: string): Promise<Game> {
    return await this.gameModel.findOne({ key: key }).exec()
  }

  async getByPlayerId(playerId: string): Promise<Game> {
    return await this.gameModel.findOne({ "players._id": playerId })
  }
}
