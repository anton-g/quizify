import { Test } from '@nestjs/testing';
import { Mockgoose } from "mockgoose";
import * as mongoose from "mongoose";
import { getModelToken } from '@nestjs/mongoose';
import { mockgooseProvider } from '../../providers/mockgoose.provider';
import { PlayerService } from './player.service';
import { GameService } from './game.service';
import { GameSchema } from '../schemas/game.schema';
import { PlayerSchema } from '../schemas/player.schema';
import { GameState } from '../game.state';

let mockgoose: Mockgoose = new Mockgoose(mongoose)

describe('PlayerService', () => {
  let playerService: PlayerService;
  let gameService: GameService;

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

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      components: [
        mockgooseProvider,
        gameProvider,
        playerProvider,
        PlayerService,
        GameService
      ]
    }).compile()

    playerService = module.get<PlayerService>(PlayerService)
    gameService = module.get<GameService>(GameService)
  })

  describe('connect', () => {
    it('should set socket id', async () => {
      let game = await gameService.create()
      await gameService.setState(game.key, GameState.Lobby)
      const player = await gameService.join(game.key, { name: 'Nisse' })
      const socketId = '123'
      game = await playerService.connect(player._id, socketId)
      expect(game.players[0].socketId).toBe(socketId)
    })

    it('should return falsy if player does not exist', async () => {
      const game = await playerService.connect('aabbccddeeff', '098')
      expect(game).toBeFalsy()
    })

    it('should reject if player id is not valid ObjectId', async () => {
      expect.assertions(1)
      await expect(playerService.connect('abc', 'xyz')).rejects.toEqual({
        error: 'Invalid playerId'
      })
    })

    it('should reject if socketId is empty', async () => {
      expect.assertions(1)
      await expect(playerService.connect('aabbccddeeff', '')).rejects.toEqual({
        error: 'Missing socketId'
      })
    })
  })

  afterAll(async () => {
    await mockgoose.helper.reset()
    await mongoose.disconnect()
  })
})
