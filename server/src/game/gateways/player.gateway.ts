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

@WebSocketGateway()
export class PlayerGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor (
    private readonly playerService: PlayerService,
    private readonly gameService: GameService
  ) {}

  @SubscribeMessage(GameEvents.Join)
  async onJoin(client: Socket, userId: string) {
    const game = await this.playerService.connect(userId, client.id)
    client.join(game.key)
    this.server.to(game.hostSocket).emit(GameEvents.Update, new GameDto(game))

    console.log(`[${game.key}] User ${userId} joined`)
  }

  @SubscribeMessage(GameEvents.Buzz)
  async onBuzz(client: Socket, userId: string) {
    const game: Game = await this.gameService.getByPlayerId(userId)
    if (game.state !== GameState.Playing) return

    this.server.to(game.key).emit(GameEvents.Pause)
    this.gameService.setState(game.key, GameState.Paused)
    this.server.to(game.hostSocket).emit(GameEvents.Buzzed, userId)

    console.log(`[${game.key}] User ${userId} buzzed`)
  }

  async handleDisconnect(client: Socket) {
    const game: Game = await this.playerService.disconnect(client.id)

    if (!game) return // Host was disconnected

    this.server.to(game.hostSocket).emit(GameEvents.Update, new GameDto(game))

    console.log(`[${game.key}] User with socket ${client.id} disconnected`)
  }
}
