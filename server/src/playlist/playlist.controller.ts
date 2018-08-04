import { Controller, UseFilters, Get, HttpCode, UseGuards, Req } from "@nestjs/common";
import { UserExceptionFilter } from "../common/user-exception.filter";
import { PlaylistService } from "./services/playlist.service";
import { PlaylistDto } from "./dtos/playlist.dto";
import { AuthGuard } from "@nestjs/passport";
import { SpotifyService } from "../spotify/spotify.service";

@Controller('playlist')
@UseFilters(new UserExceptionFilter())
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly spotifyService: SpotifyService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('')
  async get (@Req() { user }): Promise<PlaylistDto> {
    const userPlaylists = await this.spotifyService.getUserPlaylists(user)

    return userPlaylists.map(p => PlaylistDto.fromSpotifyPlaylist(p))
  }

  @HttpCode(200)
  @Get('featured')
  async getFeatured (): Promise<PlaylistDto[]> {
    const playlists = await this.playlistService.getFeatured()
    return playlists.map(p => new PlaylistDto(p))
  }
}
