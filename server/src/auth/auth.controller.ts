import { Controller, Get, Res, Query } from "@nestjs/common";
import { SpotifyService } from "../spotify/spotify.service";
import { UserService } from "../user/services/user.service";
import { AuthService } from "./auth.service";
import { ConfigService } from "../config/config.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    private readonly spotifyService: SpotifyService,
    private readonly userService: UserService) {}

  @Get('login')
  login (@Res() res) {
    return res.redirect(this.spotifyService.authorizeUrl)
  }

  @Get('callback')
  async callback (@Res() res, @Query() params) {
    if (params.error) {
      console.log(params.error)
      return
    }

    const result = await this.spotifyService.login(params.code)
    const userInfo = await this.spotifyService.me(result.access_token)
    const user = await this.userService.create(userInfo.id, result.access_token, result.refresh_token)
    const jwt = await this.authService.createToken(user)

    return res.redirect(`${this.config.clientUrl}/create#jwt=${jwt}`)
  }
}
