import { Controller, UseFilters, Get, HttpCode } from "@nestjs/common";
import { UserExceptionFilter } from "../common/user-exception.filter";
import { FeaturedPlaylistDto } from "./dtos/featured-playlist.dto";
import { PlaylistService } from "./services/playlist.service";

@Controller('playlist')
@UseFilters(new UserExceptionFilter())
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @HttpCode(200)
  @Get('featured')
  async get (): Promise<FeaturedPlaylistDto[]> {
    const playlists = await this.playlistService.get()
    return playlists.map(p => new FeaturedPlaylistDto(p))
  }
}
