import { Controller, Get, Res, Query, Param } from "@nestjs/common";
import { SpotifyService } from "../spotify/spotify.service";
import { UserService } from "../user/services/user.service";
import { AuthService } from "./auth.service";
import { ConfigService } from "../config/config.service";
import * as querystring from 'querystring';
import { HueService } from "../hue/hue.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    private readonly spotifyService: SpotifyService,
    private readonly hueService: HueService,
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

  @Get('hue/login/')
  hueLogin (@Res() res, @Query() params) {
    console.log(params.user)
    const data = {
      client_id: 'NWmJN0x1jvOv3AWYOu3NAxCcRPCCiGN9',
      appid: 'quizify',
      deviceid: 'quizify',
      response_type: 'code',
      state: params.user // I would assume this is a bad idea, but ¯\_(ツ)_/¯
    }
    const url = `https://api.meethue.com/oauth2/auth?${querystring.stringify(data)}`

    return res.redirect(url)
  }

  @Get('hue/callback')
  async hueCallback (@Res() res, @Query() params) {
    const result = await this.hueService.login(params.code)
    console.log(result)
    const user = await this.userService.getById(params.state)
    await this.userService.setHueInfo(user.id, result.accessToken, result.refreshToken, result.username)
    // const lights = await this.hueService.getLights(result.accessToken, result.username)
    // await this.hueService.blink(result.accessToken, result.username)

    return res.redirect(`${this.config.clientUrl}/hue`)
  }
}
