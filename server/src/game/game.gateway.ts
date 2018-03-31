import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { Server, Client } from 'socket.io';
import { PlayerService } from './player.service';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {
  constructor (
    private readonly playerService: PlayerService,
    private readonly gameService: GameService
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('join')
  onJoin(client: Client, userId: string) {
    this.playerService.connect(userId, client.id)
  }

  @SubscribeMessage('score')
  onScore(client: Client, userId: string) {
    this.playerService.score(userId, 1)
  }

  handleDisconnect(client: Client) {
    this.playerService.disconnect(client.id)
  }
}
