import { Controller, UseFilters, Get, HttpCode } from "@nestjs/common";
import { UserExceptionFilter } from "../common/user-exception.filter";
import { PlaylistService } from "./services/playlist.service";
import { PlaylistDto } from "./dtos/playlist.dto";

@Controller('playlist')
@UseFilters(new UserExceptionFilter())
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @HttpCode(200)
  @Get('featured')
  async getFeatured (): Promise<PlaylistDto[]> {
    const playlists = await this.playlistService.getFeatured()
    return playlists.map(p => new PlaylistDto(p))
  }
}
