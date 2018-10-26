import { Test } from '@nestjs/testing';
import { GameService } from "./game.service";
import { Mockgoose } from "mockgoose-fix";
import * as mongoose from "mongoose";
import { getModelToken } from '@nestjs/mongoose';
import { GameSchema } from '../schemas/game.schema';
import { PlayerSchema } from '../schemas/player.schema';
import { Game } from '../interfaces/game.interface';
import { mockgooseProvider } from '../../providers/mockgoose.provider';
import { GameState } from '../game.state';
import { JoinGameDto } from '../dtos/join-game.dto';
import { Player } from '../interfaces/player.interface';
import { UserException } from '../../common/user.exception';
import { PlaylistSchema } from '../../playlist/schemas/playlist.schema';
import { User } from '../../user/interfaces/user.interface';
import { Playlist } from '../../playlist/interfaces/playlist.interface';
import { PlaylistService } from '../../playlist/services/playlist.service';
import { UserService } from '../../user/services/user.service';
import { UserSchema } from '../../user/schemas/user.schema';
import { SpotifyService } from '../../spotify/spotify.service';
import * as i18n from 'i18n';

let mockgoose: Mockgoose = new Mockgoose(mongoose)

describe('GameService', () => {
  let gameService: GameService;
  let playlistService: PlaylistService;
  let userService: UserService;
  let userMock;
  let playlistMock;

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

  const playlistProvider = {
    provide: getModelToken('Playlist'),
    useFactory: async connection => connection.model('Playlist', PlaylistSchema),
    inject: [mockgooseProvider.provide],
  } as any;

  const userProvider = {
    provide: getModelToken('User'),
    useFactory: async connection => connection.model('user', UserSchema),
    inject: [mockgooseProvider.provide],
  } as any;

  beforeAll(async () => {
    i18n.configure({
      locales:['en', 'sv'],
      directory: '../../locales'
    });

    const module = await Test.createTestingModule({
      providers: [
        mockgooseProvider,
        gameProvider,
        playerProvider,
        playlistProvider,
        userProvider,
        GameService,
        PlaylistService,
        {
          provide: 'SpotifyService',
          useValue: {
            getUserPlaylist (user, playlistId) { return playlistMock }
          }
        }
      ]
    }).compile()

    gameService = module.get<GameService>(GameService)
    playlistService = module.get<PlaylistService>(PlaylistService)

    userMock = {
      _id: 'user-id',
      spotifyAccessToken: '',
      spotifyRefreshToken: ''
    }

    playlistMock = {
      id: 'abc',
      name: 'playlist-name',
      description: '',
      images: [{ url: '' }],
      tracks: { items: [{
        track: {
          id: 'xyz',
          name: 'track-name',
          album: { images: [{ url: '' }]},
          artists: [{ name: 'artist-name' }]
        }
      }]}
    }
  })

  describe('create', () => {
    it('should create a game with state CREATED', async () => {
      const game = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })

      expect(game.state).toBe(GameState.Created)
    })

    it('should create a game without host.socket', async () => {
      const game = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })

      expect(game.host.socket).toBe(undefined)
    })

    it('should generate different keys', async () => {
      const game1 = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })
      const game2 = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })

      expect(game1.key).not.toBe(game2.key)
    })
  })

  describe('setState', () => {
    it('should update state', async () => {
      let game = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })
      expect(game.state).toBe(GameState.Created)

      await gameService.setState(game.key, GameState.Lobby)
      game = await gameService.get(game.key)

      expect(game.state).toBe(GameState.Lobby)
    })

    it('should return falsy if key doesn\'t match', async () => {
      const game = await gameService.setState('ABC123', GameState.Created)
      expect(game).toBeFalsy()
    })

    it('should reject promise if no game is found', async () => {
      expect.assertions(1)
      await expect(gameService.setState(undefined, GameState.Created)).rejects.toEqual({
        error: 'Missing key'
      })
    })
  })

  describe('setHost', () => {
    it('should set host socket', async () => {
      let game = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })
      const hostSocketId = '123'
      game = await gameService.setHost(game.key, game.secret, hostSocketId)

      expect(game.host.socket).toBe(hostSocketId)
    })

    it('should return falsy if no game is found', async () => {
      const game = await gameService.setHost('AAAAAA', 'XYZ', 'socketId')
      expect(game).toBeFalsy()
    })

    it('should not update game if secret doesn\'t match key', async () => {
      const game = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })
      const socketId = '123'
      await gameService.setHost(game.key, 'incorrectSecret', socketId)
      const updatedGame = await gameService.get(game.key)
      expect(updatedGame.host.socket).not.toBe(socketId)
    })

    it('should reject promise if game key is falsy', async () => {
      expect.assertions(1)
      await expect(gameService.setHost('', '', '')).rejects.toEqual({
        error: 'Missing key'
      })
    })

    it('should reject promise if game secret is falsy', async () => {
      expect.assertions(1)
      await expect(gameService.setHost('ABC123', '', '')).rejects.toEqual({
        error: 'Missing secret'
      })
    })

    it('should reject promise if host.socket is falsy', async () => {
      expect.assertions(1)
      await expect(gameService.setHost('ABC123', 'XYZ', '')).rejects.toEqual({
        error: 'Missing host.socket'
      })
    })
  })

  describe('join', () => {
    it('should return a player with correct name', async () => {
      const game: Game = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })
      await gameService.setState(game.key, GameState.Lobby)

      const name = 'Nisse'
      const joinGameDto = { name: name }
      const player: Player = await gameService.join(game.key, joinGameDto)
      expect(player).toBeTruthy()
      expect(player.name).toBe(name)
    })

    it('should add player to game', async () => {
      const game: Game = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })
      await gameService.setState(game.key, GameState.Lobby)

      const name = 'Nisse'
      const joinGameDto = { name: name }
      const player: Player = await gameService.join(game.key, joinGameDto)
      const updatedGame: Game = await gameService.get(game.key)

      expect(updatedGame.players[0].name).toBe(name)
    })

    it('should reject if game key is incorrect', async () => {
      expect.assertions(1)
      await expect(gameService.join('', new JoinGameDto())).rejects.toEqual({
        error: 'Invalid key'
      })
    })

    it('should reject if game state is invalid', async () => {
      const game: Game = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })

      expect.assertions(1)
      await expect(gameService.join(game.key, new JoinGameDto())).rejects.toEqual({
        error: 'Invalid game state'
      })
    })

    it('should reject if name is missing', async () => {
      const game: Game = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })
      await gameService.setState(game.key, GameState.Lobby)

      expect.assertions(1)
      await expect(gameService.join(game.key, new JoinGameDto())).rejects.toEqual({
        error: 'Missing name'
      })
    })
  })

  describe('get', () => {
    it('should return game with correct key', async () => {
      const game = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })
      const game2 = await gameService.get(game.key)

      expect(game2.key).toBe(game.key)
    })

    it('should return null if game doesn\'t exist', async () => {
      const game = await gameService.get('invalid')
      expect(game).toBeNull()
    })
  })

  describe('getByPlayerId', () => {
    it('should get game', async () => {
      const playerName = 'Player'
      const createdGame = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })
      await gameService.setState(createdGame.key, GameState.Lobby)

      const joinGameDto: JoinGameDto = {
        name: playerName
      }
      const createdPlayer = await gameService.join(createdGame.key, joinGameDto)
      const game = await gameService.getByPlayerId(createdPlayer._id)
      expect(game.key).toBe(createdGame.key)
      expect(game.players[0].name).toBe(playerName)
    })
  })

  describe('disconnect', () => {
    let game: Game;

    beforeEach(async () => {
      game = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })
      await gameService.setState(game.key, GameState.Lobby)
      game = await gameService.setHost(game.key, game.secret, 'host-socket-id')
    })

    it('should set host connect to false', async () => {
      game = await gameService.disconnectHost('host-socket-id')
      expect(game.host.connected).toBe(false)
    })

    it('should reject if socket id is missing', async () => {
      expect.assertions(1)
      await expect(gameService.disconnectHost('')).rejects.toEqual(new UserException('Invalid socket id'))
    })
  })

  describe('reconnect', () => {
    let game: Game;

    beforeEach(async () => {
      game = await gameService.create(userMock, { playlist: playlistMock.id, deviceId: '', language: '' })
      await gameService.setState(game.key, GameState.Lobby)
      await gameService.setHost(game.key, game.secret, 'host-socket-id')
      await gameService.disconnectHost('host-socket-id')
      game = await gameService.get(game.key)
    })

    it('should update socket id', async () => {
      game = await gameService.reconnectHost(userMock.id, 'host-socket-id-new')
      expect(game.host.socket).toBe('host-socket-id-new')
    })

    it('should set connected to true', async () => {
      game = await gameService.reconnectHost(userMock.id, 'host-socket-id-new')
      expect(game.host.connected).toBe(true)
    })

    it('should reject if params are missing', async () => {
      expect.assertions(1)
      await expect(gameService.reconnectHost(userMock.id, '')).rejects.toEqual(new UserException('Invalid new socket id'))
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
