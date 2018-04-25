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
import { Game } from '../interfaces/game.interface';
import { Player } from '../interfaces/player.interface';
import { UserException } from '../../common/user.exception';

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

  describe('find', () => {
    let game: Game;
    let player: Player;

    beforeEach(async () => {
      game = await gameService.create()
      await gameService.setState(game.key, GameState.Lobby)
      player = await gameService.join(game.key, { name: 'Nisse' })
    })

    it('should find player with correct id', async () => {
      const p = await playerService.find(player._id)
      expect(p._id).toEqual(player._id)
    })
  })

  describe('score', () => {
    let game: Game;
    let player: Player;

    beforeEach(async () => {
      game = await gameService.create()
      await gameService.setState(game.key, GameState.Lobby)
      player = await gameService.join(game.key, { name: 'Nisse' })
      game = await playerService.connect(player._id, '123')
    })

    it('should increase player score', async () => {
      await playerService.score(player._id, 1)
      player = await playerService.find(player._id)
      expect(player.score).toBe(1)

      await playerService.score(player._id, 5)
      player = await playerService.find(player._id)
      expect(player.score).toBe(6)
    })

    it('should decrease player score', async () => {
      await playerService.score(player._id, 5)
      player = await playerService.find(player._id)
      expect(player.score).toBe(5)
      await playerService.score(player._id, -3)
      player = await playerService.find(player._id)
      expect(player.score).toBe(2)
    })

    it('should reject if playerId is invalid', async () => {
      const rejection = new UserException('Invalid playerId')

      expect.assertions(3)
      await expect(playerService.score('', 0)).rejects.toEqual(rejection)
      await expect(playerService.score('abcdkje', 0)).rejects.toEqual(rejection)
      await expect(playerService.score('ajskldfjlkasdjlfajskldfjasd', 0)).rejects.toEqual(rejection)
    })
  })

  afterAll(async () => {
    await mockgoose.helper.reset()
    await mongoose.disconnect()
  })
})
