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
import { Game } from '../interfaces/game.interface';
import { GameDto } from '../dtos/game.dto';
import { extractRequest } from '../../common/GatewayHelpers';
import { PlayerGameInfoDto } from '../dtos/player-game-info.dto';
import { JoinedGameDto } from '../dtos/joined-game.dto';
import { Player } from '../interfaces/player.interface';

@WebSocketGateway()
export class PlayerGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor (
    private readonly playerService: PlayerService,
    private readonly gameService: GameService
  ) {}

  @SubscribeMessage(GameEvents.Join)
  async onJoin(client: Socket, req) {
    let { data: userId, ack } = extractRequest(req)

    const game = await this.playerService.connect(userId, client.id)
    client.join(game.key)
    this.server.to(game.hostSocket).emit(GameEvents.Update, new GameDto(game))

    ack(new PlayerGameInfoDto(game))

    console.log(`[${game.key}] User ${userId} joined`)
  }

  @SubscribeMessage(GameEvents.Buzz)
  async onBuzz(client: Socket, req) {
    let { data: userId, ack } = extractRequest(req)

    const game: Game = await this.gameService.getByPlayerId(userId)
    if (game.state !== GameState.Playing) return

    this.server.to(game.key).emit(GameEvents.Pause)
    this.gameService.setState(game.key, GameState.Paused)
    this.server.to(game.hostSocket).emit(GameEvents.Buzzed, userId)

    ack()

    console.log(`[${game.key}] User ${userId} buzzed`)
  }

  @SubscribeMessage(GameEvents.Reconnect)
  async onReconnect(client: Socket, req) {
    let { data: oldSocketId, ack } = extractRequest(req)

    const game: Game = await this.playerService.reconnect(oldSocketId, client.id)

    if (!game) return // could not find game to reconnect to
    // TODO: ack to user

    client.join(game.key)
    this.server.to(game.hostSocket).emit(GameEvents.Update, new GameDto(game))

    const player: Player = game.players.find(p => p.socketId === client.id)
    if (!player) {
      // something went wrong, should throw error?
      ack(false)
    }

    ack(new JoinedGameDto(player, game))

    console.log(`[${game.key}] User with socket ${client.id} reconnected. Replaced old socket ${oldSocketId}`)
  }

  async handleDisconnect(client: Socket) {
    const game: Game = await this.playerService.disconnect(client.id)

    if (!game) return // Host was disconnected

    this.server.to(game.hostSocket).emit(GameEvents.Update, new GameDto(game))

    console.log(`[${game.key}] User with socket ${client.id} disconnected`)
  }
}
