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

@WebSocketGateway()
export class PlayerGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor (private readonly playerService: PlayerService) {}

  @SubscribeMessage(GameEvents.Join)
  async onJoin(client: Socket, userId: string) {
    const game = await this.playerService.connect(userId, client.id)
    client.join(game.key)
    console.log('joined room', game.key)
    this.server.to(game.hostSocket).emit(GameEvents.Update, game)
  }

  async handleDisconnect(client: Socket) {
    const game: Game = await this.playerService.disconnect(client.id)
    this.server.to(game.hostSocket).emit(GameEvents.Update, game)
  }
}
