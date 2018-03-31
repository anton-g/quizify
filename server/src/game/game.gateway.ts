import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  OnGatewayConnection,
  WebSocketServer
} from '@nestjs/websockets'
import { Server, Client } from 'socket.io';
import { PlayerService } from './player.service';

@WebSocketGateway()
export class GameGateway {
  constructor (private readonly playerService: PlayerService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('join')
  onJoin(client: Client, userId: string) {

  }

  @SubscribeMessage('score')
  onScore(client: Client, userId: string) {
    this.playerService.score(userId, 1)
  }
}
