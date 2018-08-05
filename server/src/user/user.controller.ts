import { Controller, UseFilters, Get, HttpCode, UseGuards, Req } from "@nestjs/common";
import { UserExceptionFilter } from "../common/user-exception.filter";
import { AuthGuard } from "@nestjs/passport";
import { SpotifyService } from "../spotify/spotify.service";
import { DeviceDto } from "./dtos/device.dto";

@Controller('user')
@UseFilters(new UserExceptionFilter())
export class UserController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('devices')
  async get (@Req() { user }): Promise<DeviceDto[]> {
    const devices = await this.spotifyService.getUserDevices(user)

    return devices.map(d => new DeviceDto(d))
  }
}
