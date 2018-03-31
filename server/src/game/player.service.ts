import { Model } from 'mongoose';
import { Component } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PlayerSchema } from "./schemas/player.schema";
import { Player } from "./interfaces/player.interface";

@Component()
export class PlayerService {
  constructor( @InjectModel(PlayerSchema) private readonly playerModel: Model<Player>) { }

  async create(name: string): Promise<Player> {
    const player = new this.playerModel({
      name: name,
      score: 0
    })
    return await player.save()
  }
}
