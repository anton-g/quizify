import { Test } from '@nestjs/testing';
import { GameService } from "./game.service";
import { Mockgoose } from "mockgoose";
import * as mongoose from "mongoose";
import { getModelToken } from '@nestjs/mongoose';
import { GameSchema } from '../schemas/game.schema';
import { PlayerSchema } from '../schemas/player.schema';
import { Game } from '../interfaces/game.interface';
import { Model } from 'mongoose';
import { mockgooseProvider } from '../../providers/mockgoose.provider';
import { GameState } from '../game.state';

let mockgoose: Mockgoose = new Mockgoose(mongoose)

describe('GameService', () => {
  let gameService: GameService;
  let gameModel: Model<Game>

  const gameProvider = {
    provide: getModelToken(GameSchema),
    useFactory: async connection => connection.model('game', GameSchema),
    inject: [mockgooseProvider.provide],
  } as any;

  const playerProvider = {
    provide: getModelToken(PlayerSchema),
    useFactory: async connection => connection.model('player', PlayerSchema),
    inject: [mockgooseProvider.provide],
  } as any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      components: [
        mockgooseProvider,
        gameProvider,
        playerProvider,
        GameService
      ]
    }).compile()

    gameService = module.get<GameService>(GameService)
  })

  describe('create', () => {
    it('should create a game with state CREATED', async () => {
      const game = await gameService.create()

      expect(game.state).toBe(GameState.Created)
    })

    it('should create a game without hostSocket', async () => {
      const game = await gameService.create()

      expect(game.hostSocket).toBe(undefined)
    })

    it('should generate different keys', async () => {
      const game1 = await gameService.create()
      const game2 = await gameService.create()

      expect(game1.key).not.toBe(game2.key)
    })
  })

  describe('get', () => {
    it('should return game with correct key', async () => {
      const game = await gameService.create()
      const game2 = await gameService.get(game.key)

      expect(game2.key).toBe(game.key)
    })
  })

  describe('setState', () => {
    it('should update state', async () => {
      let game = await gameService.create()
      expect(game.state).toBe(GameState.Created)

      await gameService.setState(game.key, GameState.Lobby)
      game = await gameService.get(game.key)

      expect(game.state).toBe(GameState.Lobby)
    })
  })

  afterEach(async () => {
    await mockgoose.helper.reset()
    await mongoose.disconnect()
  })
})
