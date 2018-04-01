import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io';
import { PlayerService } from './player.service';
import { GameEvents } from './game.state';
import { Game } from './interfaces/game.interface';
import { GameService } from './game.service';

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
    this.server.to(game.hostSocket).emit(GameEvents.Update, game)

    console.log(`[${game.key}] User ${userId} joined`)
  }

  @SubscribeMessage(GameEvents.Buzz)
  async onBuzz(client: Socket, userId: string) {
    const game: Game = await this.gameService.getByPlayerId(userId)
    this.server.to(game.key).emit(GameEvents.Pause)
    this.server.to(game.hostSocket).emit(GameEvents.Buzzed, userId)

    console.log(`[${game.key}] User ${userId} buzzed`)
  }

  async handleDisconnect(client: Socket) {
    const game: Game = await this.playerService.disconnect(client.id)
    this.server.to(game.hostSocket).emit(GameEvents.Update, game)

    console.log(`[${game.key}] User with socket ${client.id} disconnected`)
  }
}
