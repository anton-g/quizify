import { Model } from 'mongoose';
import { Component } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GameSchema } from './schemas/game.schema';
import { Game } from './interfaces/game.interface';
import { Player } from './interfaces/player.interface';

@Component()
export class PlayerService {
  constructor(
    @InjectModel(GameSchema) private readonly gameModel: Model<Game>
  ) { }

  async score(id: string, score: number): Promise<Player> {
    const result: Game = await this.gameModel.findOneAndUpdate(
      { "players._id": id },
      { $inc: { "players.$.score": score } }
    ).exec()

    return result.players.find(p => p._id == id)
  }

  async connect(id: string, socketId: string): Promise<Game> {
    console.log('Connecting user', id)
    return await this.gameModel.findOneAndUpdate(
      { "players._id": id },
      { $set: { "players.$.socketId": socketId } }
    ).exec()
  }

  async disconnect(id: string) {
    return await this.gameModel.findOneAndUpdate(
      { "players.socketId": id },
      { $set: { "players.$.socketId": null } }
    )
  }
}
