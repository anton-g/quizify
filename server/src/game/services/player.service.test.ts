import { Test } from '@nestjs/testing';
import { mockgooseProvider } from '../../providers/mockgoose.provider';
import { Mockgoose } from "mockgoose-fix";
import * as mongoose from "mongoose";
import { getModelToken } from '@nestjs/mongoose';
import { PlayerService } from './player.service';
import { GameService } from './game.service';
import { GameSchema } from '../schemas/game.schema';
import { PlayerSchema } from '../schemas/player.schema';
import { GameState } from '../game.state';
import { Game } from '../interfaces/game.interface';
import { Player } from '../interfaces/player.interface';
import { UserException } from '../../common/user.exception';
import { PlaylistSchema } from '../schemas/playlist.schema';

let mockgoose: Mockgoose = new Mockgoose(mongoose)

describe('PlayerService', () => {
  let playerService: PlayerService;
  let gameService: GameService;

  const gameProvider = {
    provide: getModelToken('Game'),
    useFactory: async connection => connection.model('game', GameSchema),
    inject: [mockgooseProvider.provide],
  } as any;

  const playerProvider = {
    provide: getModelToken('Player'),
    useFactory: async connection => connection.model('player', PlayerSchema),
    inject: [mockgooseProvider.provide],
  } as any;

  const PlaylistProvider = {
    provide: getModelToken('Playlist'),
    useFactory: async connection => connection.model('Playlist', PlaylistSchema),
    inject: [mockgooseProvider.provide],
  } as any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        mockgooseProvider,
        gameProvider,
        playerProvider,
        PlaylistProvider,
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

    it('should throw error if player does not exist', async () => {
      const playerId = 'incorrect_id'
      expect.assertions(1)
      await expect(playerService.find(playerId)).rejects.toEqual(
        new UserException(`Can't find player with id ${playerId}`)
      )
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

  describe('disconnect', () => {
    let game: Game;
    let player: Player;

    beforeEach(async () => {
      game = await gameService.create()
      await gameService.setState(game.key, GameState.Lobby)
      player = await gameService.join(game.key, { name: 'Nisse' })
      game = await playerService.connect(player._id, 'disconnect_123')
      player = await playerService.find(player._id)
    })

    it('should set connected to false', async () => {
      await playerService.disconnect(player.socketId)
      player = await playerService.find(player._id)
      expect(player.connected).toBe(false)
    })

    it('should reject if socket id is missing', async () => {
      expect.assertions(1)
      await expect(playerService.disconnect('')).rejects.toEqual(new UserException('Invalid socket id'))
    })
  })

  describe('reconnect', () => {
    let game: Game;
    let player: Player;

    beforeEach(async () => {
      game = await gameService.create()
      await gameService.setState(game.key, GameState.Lobby)
      player = await gameService.join(game.key, { name: 'Nisse' })
      game = await playerService.connect(player._id, 'reconnect_123')
      game = await playerService.disconnect('reconnect_123')
      player = await playerService.find(player._id)
    })

    it('should update socketid', async () => {
      await playerService.reconnect(player.socketId, 'reconnect_456')
      player = await playerService.find(player._id)
      expect(player.socketId).toBe('reconnect_456')
    })

    it('should set connected to true', async () => {
      await playerService.reconnect(player.socketId, 'reconnect_456')
      player = await playerService.find(player._id)
      expect(player.connected).toBe(true)
    })

    it('should reject if params are missing', async () => {
      expect.assertions(2)
      await expect(playerService.reconnect('', 'reconnect_456')).rejects.toEqual(new UserException('Invalid old socket id'))
      await expect(playerService.reconnect(player.socketId, '')).rejects.toEqual(new UserException('Invalid new socket id'))
    })
  })

  afterAll(async () => {
    await mockgoose.helper.reset();
    await mongoose.disconnect();
    await mockgoose.mongodHelper.mongoBin.childProcess.on('exit', () => {
      mockgoose.mongodHelper.mongoBin.childProcess.kill('SIGTERM');
    });
  })
})
