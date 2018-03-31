import { Model } from 'mongoose';
import { Component } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PlayerSchema } from "./schemas/player.schema";
import { Player } from "./interfaces/player.interface";
import { GameSchema } from './schemas/game.schema';
import { Game } from './interfaces/game.interface';

@Component()
export class PlayerService {
  constructor( @InjectModel(GameSchema) private readonly gameModel: Model<Game>) { }

  async score(id: string, score: number) {
    const result = await this.gameModel.findOneAndUpdate(
      { "players._id": id },
      { $inc: { "players.$.score": score } }
    ).exec()
  }

  async connect(id: string, socketId: string) {
    const result = await this.gameModel.findOneAndUpdate(
      { "players._id": id },
      { $set: { "players.$.socketId": socketId } }
    ).exec()
  }

  async disconnect(id: string) {
    const result = await this.gameModel.findOneAndUpdate(
      { "players.socketId": id },
      { $set: { "players.$.socketId": null } }
    )
  }
}
