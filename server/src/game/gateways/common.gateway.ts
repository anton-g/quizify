import {
  WebSocketGateway,
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
export class CommonGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor (
    private readonly playerService: PlayerService,
    private readonly gameService: GameService
  ) {}

  async handleDisconnect(client: Socket) {
    let game: Game = await this.playerService.disconnect(client.id)

    if (!game) {
      // Handle host disconnect
      game = await this.gameService.disconnectHost(client.id)
      if (game.state === GameState.Playing) {
        this.server.to(game.key).emit(GameEvents.Pause)
        await this.gameService.setState(game.key, GameState.Paused)
      }
    } else {
      // Handle player disconnect
      this.server.to(game.host.socket).emit(GameEvents.Update, new GameDto(game))

      console.log(`[${game.key}] Player with socket ${client.id} disconnected`)
    }
  }
}
