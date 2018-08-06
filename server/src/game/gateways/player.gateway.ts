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
import { UsePipes } from '../../../node_modules/@nestjs/common';
import { ParseSocketDataPipe } from '../../common/parse-socket-data.pipe';
import { SpotifyService } from '../../spotify/spotify.service';

@UsePipes(ParseSocketDataPipe)
@WebSocketGateway()
export class PlayerGateway {
  @WebSocketServer() server: Server;

  constructor (
    private readonly playerService: PlayerService,
    private readonly gameService: GameService,
    private readonly spotify: SpotifyService
  ) {}

  @SubscribeMessage(GameEvents.Join)
  async onJoin(client: Socket, { data: userId, ack }) {
    const game = await this.playerService.connect(userId, client.id)
    client.join(game.key)
    this.server.to(game.host.socket).emit(GameEvents.Update, new GameDto(game))

    ack(new PlayerGameInfoDto(game))

    console.log(`[${game.key}] User ${userId} joined`)
  }

  @SubscribeMessage(GameEvents.Buzz)
  async onBuzz(client: Socket, { data: userId, ack }) {
    const game: Game = await this.gameService.getByPlayerId(userId)
    if (game.state !== GameState.Playing) return

    this.server.to(game.key).emit(GameEvents.Pause)
    this.gameService.setState(game.key, GameState.Paused)
    this.server.to(game.host.socket).emit(GameEvents.Buzzed, userId)

    this.spotify.pausePlayback(game.host.user)

    ack()

    console.log(`[${game.key}] User ${userId} buzzed`)
  }

  @SubscribeMessage(GameEvents.ReconnectPlayer)
  async onReconnect(client: Socket, { data: oldSocketId, ack }) {
    const game: Game = await this.playerService.reconnect(oldSocketId, client.id)

    if (!game) return // could not find game to reconnect to
    // TODO: ack to user

    client.join(game.key)
    this.server.to(game.host.socket).emit(GameEvents.Update, new GameDto(game))

    const player: Player = game.players.find(p => p.socketId === client.id)
    if (!player) {
      // something went wrong, should throw error?
      ack(false)
    }

    ack(new JoinedGameDto(player, game))

    console.log(`[${game.key}] User with socket ${client.id} reconnected. Replaced old socket ${oldSocketId}`)
  }
}
