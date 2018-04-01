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
import { GameService } from './game.service';
import { GameState, GameEvents } from './game.state';
import { GameSchema } from './schemas/game.schema';
import { Player } from './interfaces/player.interface';

@WebSocketGateway()
export class HostGateway {
  @WebSocketServer() server: Server;

  constructor (
    private readonly playerService: PlayerService,
    private readonly gameService: GameService
  ) {}

  @SubscribeMessage(GameEvents.Host)
  onHost(client: Socket, keys: any) {
    console.log('set host', client.id)
    this.gameService.setHost(keys.key, keys.secret, client.id)
    this.gameService.setState(keys.key, GameState.Lobby)
  }

  @SubscribeMessage(GameEvents.Start)
  async onStart(client: Socket, key: string) {
    console.log('start game')
    const game = await this.gameService.get(key)
    this.gameService.setState(game.key, GameState.Playing)
    this.server.to(key).emit(GameEvents.Start)
  }

  @SubscribeMessage(GameEvents.Resume)
  async onResume(client: Socket, key: string) {
    this.server.to(key).emit(GameEvents.Resume)
  }

  @SubscribeMessage(GameEvents.Score)
  async onScore(client: Socket, userId: string) {
    console.log('User scored', userId)
    const score: number = 1
    const player: Player = await this.playerService.score(userId, score)
    this.server.to(player.socketId).emit(GameEvents.Scored, score)
  }
}
