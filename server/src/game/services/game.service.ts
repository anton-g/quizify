import { Model, Mongoose } from 'mongoose';
import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Game } from '../interfaces/game.interface';
import * as nanoid from 'nanoid';
import * as generate from 'nanoid/generate';
import { JoinGameDto } from '../dtos/join-game.dto';
import { Player } from '../interfaces/player.interface';
import { GameState } from '../game.state';
import { UserException } from '../../common/user.exception';
import { Playlist } from '../../playlist/interfaces/playlist.interface';
import { CreateQuizOptionsDto } from '../dtos/create-quiz-options.dto';
import { SpotifyService } from '../../spotify/spotify.service';
import { User } from '../../user/interfaces/user.interface';
import { PlaylistService } from '../../playlist/services/playlist.service';

@Injectable()
export class GameService {
  constructor(
    @InjectModel('Game') private readonly gameModel: Model<Game>,
    @InjectModel('Player') private readonly playerModel: Model<Player>,
    @InjectModel('Playlist') private readonly playlistModel: Model<Playlist>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly spotifyService: SpotifyService,
    private readonly playlistService: PlaylistService
  ) { }

  async create(user: User, options: CreateQuizOptionsDto): Promise<Game> {
    const playlist = await this._getPlaylist(user, options.playlist)

    const secret: string = nanoid()
    const key: string = generate('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6)

    const questions = [
      {
        question: 'What is the name of the artist?',
        track: {
          artist: 'Haddaway',
          song: 'What is love?',
          length: 232,
          img: 'https://picsum.photos/200/200/?image=11'
        }
      },
      {
        question: 'What is the name of the song?',
        track: {
          artist: 'Glennmark Eriksson Strömstedt',
          song: 'När vi gräver guld i USA',
          length: 232,
          img: 'https://picsum.photos/200/200/?image=23'
        }
      },
      {
        question: 'What is the name of the artist?',
        track: {
          artist: 'Bleachers',
          song: 'Dont Take The Money',
          length: 232,
          img: 'https://picsum.photos/200/200/?image=55'
        }
      }
    ]

    const game = new this.gameModel({
      state: GameState.Created,
      secret: secret,
      key: key,
      host: {
        socket: undefined,
        connected: false,
        user: user.id
      },
      questions: questions,
      currentQuestionNo: 1,
      playlist: playlist.id
    })
    await game.save()

    return this.get(game.key)
  }

  async setState(key: string, state: GameState): Promise<Game> {
    if (!key) return Promise.reject(new UserException('Missing key'))

    return await this._findOneAndUpdate(
      { "key": key.toUpperCase() },
      { $set: { "state": state } }
    )
  }

  async setHost(key: string, secret: string, hostSocket: string): Promise<Game> {
    if (!key) return Promise.reject(new UserException('Missing key'))
    if (!secret) return Promise.reject(new UserException('Missing secret'))
    if (!hostSocket) return Promise.reject(new UserException('Missing host.socket'))

    return await this._findOneAndUpdate(
      { "key": key.toUpperCase(), "secret": secret },
      { $set:
        {
          "host.socket": hostSocket,
          "host.connected": true
        }
      }
    )
  }

  async setPlaylist(user: User, playlistId: string) {
    if (!user) return Promise.reject(new UserException('Missing user'))
    if (!playlistId) return Promise.reject(new UserException('Missing playlist id'))

    const playlist = await this._getPlaylist(user, playlistId)

    return await this._findOneAndUpdate(
      { "host.user": user.id },
      { $set:
        {
          "playlist": playlist.id
        }
      }
    )
  }

  async join(key: string, joinGameDto: JoinGameDto): Promise<Player> {
    const game = await this.get(key)
    if (!game) return Promise.reject(new UserException('Invalid key'))
    if (game.state !== GameState.Lobby) return Promise.reject(new UserException('Invalid game state'))
    if (!joinGameDto.name) return Promise.reject(new UserException('Missing name'))

    const player = new this.playerModel({
      name: joinGameDto.name,
      score: 0,
      socketId: undefined
    })
    game.players.push(player)

    await new this.gameModel(game).save()

    return player
  }

  async get(key: string): Promise<Game> {
    return await this._findOne({ key: key.toUpperCase() })
  }

  async update(key: string, game: Partial<Game>): Promise<Game> {
    return await this._findOneAndUpdate({ 'key': key.toUpperCase() }, game)
  }

  async getByPlayerId(playerId: string): Promise<Game> {
    return await this._findOne({ "players._id": playerId })
  }

  async disconnectHost(hostSocketId: string): Promise<Game> {
    if (!hostSocketId) return Promise.reject(new UserException('Invalid socket id'))

    const result: Game = await this._findOneAndUpdate(
      { "host.socket": hostSocketId },
      { $set: { "host.connected": false } }
    )

    return result
  }

  async reconnectHost(oldSocketId: string, newSocketId: string): Promise<Game> {
    if (!oldSocketId) return Promise.reject(new UserException('Invalid old socket id'))
    if (!newSocketId) return Promise.reject(new UserException('Invalid new socket id'))

    const result: Game = await this._findOneAndUpdate(
      {
        "host.socket": oldSocketId,
        "state": { $ne: GameState.Ended }
      },
      { $set: {
        "host.socket": newSocketId,
        "host.connected": true
      } }
    )

    return result
  }

  private async _getPlaylist(user: User, playlistId: string): Promise<Playlist> {
    const spotifyPlaylist = await this.spotifyService.getUserPlaylist(user, playlistId)
    return await this.playlistService.create(spotifyPlaylist)
  }

  private async _findOneAndUpdate(conditions, update) {
    return await this.gameModel
                    .findOneAndUpdate(
                      conditions,
                      update,
                    { new: true })
                    .populate({
                      path: 'host.user',
                      model: this.userModel
                    })
                    .populate({
                      path: 'playlist',
                      model: this.playlistModel
                    })
                    .exec()
  }

  private async _findOne(conditions: any) {
    return await this.gameModel
                    .findOne(conditions)
                    .populate({
                      path: 'host.user',
                      model: this.userModel
                    })
                    .populate({
                      path: 'playlist',
                      model: this.playlistModel
                    })
                    .exec()
  }
}
