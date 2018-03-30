import { Model } from 'mongoose';
import { Component } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { GameSchema } from './schemas/game.schema';
import { Game } from './interfaces/game.interface';
import * as nanoid from 'nanoid';
import * as generate from 'nanoid/generate';

@Component()
export class GameService {
    constructor(@InjectModel(GameSchema) private readonly gameModel: Model<Game>) {}

    async create(): Promise<Game> {
        const secret: string = nanoid()
        const key: string = generate('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6)

        const game = new this.gameModel({
            secret: secret,
            key: key
        })
        return await game.save()
    }

    async get(key: string): Promise<Game> {
        const result = await this.gameModel.find({ key: key }).limit(1).exec()
        return result[0]
    }
}