import { Model } from 'mongoose';
import { Component } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { GameSchema } from './schemas/game.schema';
import { Game } from './interfaces/game.interface';
import * as nanoid from 'nanoid';
import * as generate from 'nanoid/generate';
import { JoinGameDto } from './dtos/join-game.dto';
import { PlayerSchema } from './schemas/player.schema';
import { Player } from './interfaces/player.interface';

@Component()
export class GameService {
  constructor(
    @InjectModel(GameSchema) private readonly gameModel: Model<Game>,
    @InjectModel(PlayerSchema) private readonly playerModel: Model<Player>
  ) { }

  async create(): Promise<Game> {
    const secret: string = nanoid()
    const key: string = generate('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6)

    const game = new this.gameModel({
      secret: secret,
      key: key
    })
    return await game.save()
  }

  async join(key: string, joinGameDto: JoinGameDto): Promise<Game> {
    const game = await this.get(key)
    if (!game) return // error?

    game.players.push(this.playerModel({
      name: joinGameDto.name,
      score: 0,
      socketId: null
    }))

    return await new this.gameModel(game).save()
  }

  async get(key: string): Promise<Game> {
    const result = await this.gameModel.find({ key: key }).limit(1).exec()
    return result[0]
  }
}
