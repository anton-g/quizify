import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect
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
import { ParseSocketDataPipe } from '../../common/parse-socket-data.pipe';
import { SocketAuthPipe } from '../../common/socket-auth.pipe';
import { SpotifyService } from '../../spotify/spotify.service';

@UsePipes(ParseSocketDataPipe)
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
  async onHost(client: Socket, { data: keys, ack }) {
    await this.gameService.setHost(keys.key, keys.secret, client.id)
    const game = await this.gameService.setState(keys.key, GameState.Lobby)

    ack(new GameDto(game))

    console.log(`[${keys.key}] Set host socket to '${client.id}' using secret '${keys.secret}'`)
  }

  @UseGuards(EventAuthGuard)
  @UsePipes(SocketAuthPipe)
  @SubscribeMessage(GameEvents.ChangePlaylist)
  async onChangePlaylist(client: Socket, { data, user, ack }) {
    const game = await this.gameService.setPlaylist(user, data.playlist)
    ack(new GameDto(game))

    this.server.to(game.key).emit(GameEvents.ChangePlaylist, new PlayerGameInfoDto(game))
  }

  @UseGuards(EventAuthGuard)
  @UsePipes(SocketAuthPipe)
  @SubscribeMessage(GameEvents.Start)
  async onStart(client: Socket, { data, user, ack }) {
    const key = data.key
    let game = await this.gameService.get(key)
    game = await this.gameService.setState(game.key, GameState.Paused)

    const trackUri = game.playlist.tracks[0].uri
    await this.spotify.playTrack(user, trackUri)
    await this.spotify.pausePlayback(user)

    const gameUpdate: Partial<PlayerGameInfoDto> = {
      state: game.state
    }
    this.server.to(data.key).emit(GameEvents.Start, gameUpdate)

    ack(new GameDto(game))

    console.log(`[${key}] Start game`)
  }

  @UseGuards(EventAuthGuard)
  @UsePipes(SocketAuthPipe)
  @SubscribeMessage(GameEvents.Resume)
  async onResume(client: Socket, { data, user, ack }) {
    const key = data.key
    this.server.to(key).emit(GameEvents.Resume)
    const game = await this.gameService.setState(key, GameState.Playing)
    this.spotify.resumePlayback(user)

    ack(new GameDto(game))

    console.log(`[${key}] Resume game`)
  }

  @UseGuards(EventAuthGuard)
  @UsePipes(SocketAuthPipe)
  @SubscribeMessage(GameEvents.Pause)
  async onPause(client: Socket, { data, user, ack }) {
    const key = data.key
    this.server.to(key).emit(GameEvents.Pause)
    const game = await this.gameService.setState(key, GameState.Paused)
    this.spotify.pausePlayback(user)

    ack(new GameDto(game))

    console.log(`[${key}] Paused game`)
  }

  @UseGuards(EventAuthGuard)
  @SubscribeMessage(GameEvents.Score)
  async onScore(client: Socket, { data, ack }) {
    const userId = data.userId
    const score: number = 1
    const player: Player = await this.playerService.score(userId, score)
    this.server.to(player.socketId).emit(GameEvents.Scored, score)

    ack(new PlayerDto(player))

    console.log(`[?] Player ${player.name} (${userId}) scored ${score}`)
  }

  @UseGuards(EventAuthGuard)
  @SubscribeMessage(GameEvents.NextQuestion)
  async onNextQuestion(client: Socket, { data, ack }) {
    const key = data.key
    let game = await this.gameService.get(key)
    if (!game || game.host.socket !== client.id || game.currentQuestionNo === game.playlist.tracks.length) {
      return
    }

    game = await this.gameService.update(game.key, {
      currentQuestionNo: game.currentQuestionNo + 1,
    })

    const gameUpdate: Partial<GameDto> = {
      currentQuestionNo: game.currentQuestionNo
    }
    this.server.to(game.key).emit(GameEvents.NextQuestion, gameUpdate)

    ack(gameUpdate)

    console.log(`[${game.key}] Next question (${game.currentQuestionNo}/${game.playlist.tracks.length})`)
  }

  @UseGuards(EventAuthGuard)
  @SubscribeMessage(GameEvents.PrevQuestion)
  async onPrevQuestion(client: Socket, { data, ack }) {
    const key = data.key
    let game = await this.gameService.get(key)
    if (!game || game.host.socket !== client.id || game.currentQuestionNo <= 1) {
      return
    }

    game = await this.gameService.update(game.key, {
      currentQuestionNo: game.currentQuestionNo - 1,
    })

    const gameUpdate: Partial<GameDto> = {
      currentQuestionNo: game.currentQuestionNo
    }
    this.server.to(game.key).emit(GameEvents.PrevQuestion, gameUpdate)

    ack(gameUpdate)

    console.log(`[${game.key}] Previous question (${game.currentQuestionNo}/${game.playlist.tracks.length})`)
  }

  @UseGuards(EventAuthGuard)
  @SubscribeMessage(GameEvents.EndGame)
  async onEndGame(client: Socket, { data, ack }) {
    const key = data.key
    let game = await this.gameService.get(key)
    if (!game || game.host.socket !== client.id) {
      return
    }

    game = await this.gameService.setState(game.key, GameState.Ended)

    const gameEnded = new GameEndedDto(game)
    this.server.to(game.key).emit(GameEvents.EndGame, gameEnded)

    ack(gameEnded)

    console.log(`[${game.key}] Game ended`)
  }

  @UseGuards(EventAuthGuard)
  @SubscribeMessage(GameEvents.ReconnectHost)
  async onReconnect(client: Socket, { data, ack }) {
    const socketId = data.socketId
    const game: Game = await this.gameService.reconnectHost(socketId, client.id)

    if (!game) return // could not find game to reconnect to
    // should probably do some error handling here

    ack(new GameDto(game))

    console.log(`[${game.key}] Host with socket ${client.id} reconnected. Replaced old socket ${socketId}`)
  }
}
