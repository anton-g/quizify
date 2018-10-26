import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io';
import { PlayerService } from '../services/player.service';
import { GameService } from '../services/game.service';
import { GameEvents, GameState } from '../game.state';
import { Player } from '../interfaces/player.interface';
import { GameDto } from '../dtos/game.dto';
import { PlayerDto } from '../dtos/player.dto';
import { Game } from '../interfaces/game.interface';
import { PlayerGameInfoDto } from '../dtos/player-game-info.dto';
import { GameEndedDto } from '../dtos/game-ended.dto';
import { UseGuards, UsePipes } from '@nestjs/common';
import { EventAuthGuard } from '../../common/EventAuth.guard';
import { SocketAuthPipe } from '../../common/socket-auth.pipe';
import { SpotifyService } from '../../spotify/spotify.service';

@WebSocketGateway()
export class HostGateway {
  @WebSocketServer() server: Server;

  constructor (
    private readonly playerService: PlayerService,
    private readonly gameService: GameService,
    private readonly spotify: SpotifyService
  ) {}

  @UseGuards(EventAuthGuard)
  @SubscribeMessage(GameEvents.Host)
  async onHost(client: Socket, keys) {
    console.log('host')
    await this.gameService.setHost(keys.key, keys.secret, client.id)
    const game = await this.gameService.setState(keys.key, GameState.Lobby)

    console.log(`[${keys.key}] Set host socket to '${client.id}' using secret '${keys.secret}'`)
    return new GameDto(game)
  }

  @UseGuards(EventAuthGuard)
  @UsePipes(SocketAuthPipe)
  @SubscribeMessage(GameEvents.ChangePlaylist)
  async onChangePlaylist(client: Socket, { data, user }) {
    const game = await this.gameService.setPlaylist(user, data.playlist, data.lang)

    this.server.to(game.key).emit(GameEvents.ChangePlaylist, new PlayerGameInfoDto(game))

    return new GameDto(game)
  }

  @UseGuards(EventAuthGuard)
  @UsePipes(SocketAuthPipe)
  @SubscribeMessage(GameEvents.Start)
  async onStart(client: Socket, { data, user }) {
    const key = data.key
    let game = await this.gameService.get(key)
    game = await this.gameService.setState(game.key, GameState.Paused)

    await this.spotify.pausePlayback(user)

    const gameUpdate: Partial<PlayerGameInfoDto> = {
      state: game.state
    }
    this.server.to(data.key).emit(GameEvents.Start, gameUpdate)

    console.log(`[${key}] Start game`)
    return new GameDto(game)
  }

  @UseGuards(EventAuthGuard)
  @UsePipes(SocketAuthPipe)
  @SubscribeMessage(GameEvents.Resume)
  async onResume(client: Socket, { data, user }) {
    const key = data.key
    this.server.to(key).emit(GameEvents.Resume)
    const game = await this.gameService.setState(key, GameState.Playing)

    if ((game.currentQuestionNo - 1) !== game.activeTrackIdx) {
      const newTrackIdx = game.currentQuestionNo - 1

      const trackUri = game.playlist.tracks[newTrackIdx].uri
      await this.spotify.playTrack(user, trackUri, game.deviceId)

      this.gameService.update(game.key, {
        activeTrackIdx: newTrackIdx
      })
    } else {
      this.spotify.resumePlayback(user)
    }

    console.log(`[${key}] Resume game`)
    return new GameDto(game)
  }

  @UseGuards(EventAuthGuard)
  @UsePipes(SocketAuthPipe)
  @SubscribeMessage(GameEvents.Pause)
  async onPause(client: Socket, { data, user }) {
    const key = data.key
    this.server.to(key).emit(GameEvents.Pause)
    const game = await this.gameService.setState(key, GameState.Paused)
    this.spotify.pausePlayback(user)

    console.log(`[${key}] Paused game`)
    return new GameDto(game)
  }

  @UseGuards(EventAuthGuard)
  @SubscribeMessage(GameEvents.Score)
  async onScore(client: Socket, data) {
    const userId = data.userId
    const score: number = 1
    const player: Player = await this.playerService.score(userId, score)
    this.server.to(player.socketId).emit(GameEvents.Scored, score)

    console.log(`[?] Player ${player.name} (${userId}) scored ${score}`)

    return new PlayerDto(player)
  }

  @UseGuards(EventAuthGuard)
  @UsePipes(SocketAuthPipe)
  @SubscribeMessage(GameEvents.NextQuestion)
  async onNextQuestion(client: Socket, { data, user }) {
    const key = data.key
    let game = await this.gameService.get(key)
    if (!game || game.host.socket !== client.id || game.currentQuestionNo === game.playlist.tracks.length) {
      return
    }

    game = await this.gameService.update(game.key, {
      currentQuestionNo: game.currentQuestionNo + 1,
      state: GameState.Paused
    })

    await this.spotify.pausePlayback(user)

    const gameUpdate: Partial<GameDto> = {
      currentQuestionNo: game.currentQuestionNo,
      state: GameState.Paused
    }
    this.server.to(game.key).emit(GameEvents.NextQuestion, gameUpdate)

    console.log(`[${game.key}] Next question (${game.currentQuestionNo}/${game.playlist.tracks.length})`)
    return gameUpdate
  }

  @UseGuards(EventAuthGuard)
  @UsePipes(SocketAuthPipe)
  @SubscribeMessage(GameEvents.PrevQuestion)
  async onPrevQuestion(client: Socket, { data, user }) {
    const key = data.key
    let game = await this.gameService.get(key)
    if (!game || game.host.socket !== client.id || game.currentQuestionNo <= 1) {
      return
    }

    game = await this.gameService.update(game.key, {
      currentQuestionNo: game.currentQuestionNo - 1,
      state: GameState.Paused
    })

    await this.spotify.pausePlayback(user)

    const gameUpdate: Partial<GameDto> = {
      currentQuestionNo: game.currentQuestionNo,
      state: GameState.Paused
    }
    this.server.to(game.key).emit(GameEvents.PrevQuestion, gameUpdate)

    console.log(`[${game.key}] Previous question (${game.currentQuestionNo}/${game.playlist.tracks.length})`)
    return gameUpdate
  }

  @UseGuards(EventAuthGuard)
  @UsePipes(SocketAuthPipe)
  @SubscribeMessage(GameEvents.EndGame)
  async onEndGame(client: Socket, { data, user }) {
    const key = data.key
    let game = await this.gameService.get(key)
    if (!game || game.host.socket !== client.id) {
      return
    }

    game = await this.gameService.setState(game.key, GameState.Ended)

    await this.spotify.pausePlayback(user)

    const gameEnded = new GameEndedDto(game)
    this.server.to(game.key).emit(GameEvents.EndGame, gameEnded)

    console.log(`[${game.key}] Game ended`)
    return gameEnded
  }

  @UseGuards(EventAuthGuard)
  @UsePipes(SocketAuthPipe)
  @SubscribeMessage(GameEvents.ReconnectHost)
  async onReconnect(client: Socket, { user }) {
    const game: Game = await this.gameService.reconnectHost(user.id, client.id)

    if (!game) return // could not find game to reconnect to
    // should probably do some error handling here

    console.log(`[${game.key}] Host with socket ${client.id} reconnected.`)
    return new GameDto(game)
  }
}
