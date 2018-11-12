import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io';
import { PlayerService } from '../services/player.service';
import { GameService } from '../services/game.service';
import { GameEvents, GameState } from '../game.state';
import { Game } from '../interfaces/game.interface';
import { GameDto } from '../dtos/game.dto';
import { PlayerGameInfoDto } from '../dtos/player-game-info.dto';
import { JoinedGameDto } from '../dtos/joined-game.dto';
import { Player } from '../interfaces/player.interface';
import { SpotifyService } from '../../spotify/spotify.service';

@WebSocketGateway()
export class PlayerGateway {
  @WebSocketServer() server: Server;

  constructor (
    private readonly playerService: PlayerService,
    private readonly gameService: GameService,
    private readonly spotify: SpotifyService
  ) {}

  @SubscribeMessage(GameEvents.Join)
  async onJoin(client: Socket, userId) {
    const game = await this.playerService.connect(userId, client.id)
    client.join(game.key)

    const gameUpdate: Partial<Game> = {
      players: game.players
    }
    this.server.to(game.key).emit(GameEvents.Update, gameUpdate)

    console.log(`[${game.key}] User ${userId} joined`)
    return new PlayerGameInfoDto(game)
  }

  @SubscribeMessage(GameEvents.Buzz)
  async onBuzz(client: Socket, userId) {
    const game: Game = await this.gameService.getByPlayerId(userId)
    if (game.state !== GameState.Playing) return

    this.server.to(game.key).emit(GameEvents.Pause)
    this.gameService.setState(game.key, GameState.Paused)
    this.server.to(game.host.socket).emit(GameEvents.Buzzed, userId)

    this.spotify.pausePlayback(game.host.user)

    console.log(`[${game.key}] User ${userId} buzzed`)
  }

  @SubscribeMessage(GameEvents.Leave)
  async onLeave(client: Socket) {
    const game = await this.playerService.leave(client.id)

    const gameUpdate: Partial<Game> = {
      players: game.players
    }
    this.server.to(game.key).emit(GameEvents.Update, gameUpdate)

    console.log(`[${game.key}] Player with socket ${client.id} left game`)
  }

  @SubscribeMessage(GameEvents.ReconnectPlayer)
  async onReconnect(client: Socket, oldSocketId) {
    const game: Game = await this.playerService.reconnect(oldSocketId, client.id)

    if (!game) return // could not find game to reconnect to
    // TODO: ack to user

    client.join(game.key)

    const gameUpdate: Partial<Game> = {
      players: game.players
    }
    this.server.to(game.key).emit(GameEvents.Update, gameUpdate)

    const player: Player = game.players.find(p => p.socketId === client.id)
    if (!player) {
      // something went wrong, should throw error?
      return false
    }

    console.log(`[${game.key}] User with socket ${client.id} reconnected. Replaced old socket ${oldSocketId}`)
    return new JoinedGameDto(player, game)
  }
}
