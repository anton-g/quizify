import { Controller, Get, Res, Query, Req } from "@nestjs/common";
import { HueService } from "../hue/hue.service";
import { UserService } from "../user/services/user.service";
import { ConfigService } from "../config/config.service";
import * as querystring from 'querystring';
import * as jwt from 'jsonwebtoken';
import { UserException } from "../common/user.exception";
import { AuthService } from "../auth/auth.service";

@Controller('hue')
export class HueController {
  constructor(
    private readonly config: ConfigService,
    private readonly hueService: HueService,
    private readonly userService: UserService) {}

  @Get('login')
  async login (@Req() req, @Res() res, @Query() params) {
    const token = req.cookies.jwt

    // TODO refactor
    const payload = this.validateJwt(token) as any
    const user = await this.userService.getById(payload.id)
    if (!user) throw new UserException('err')

    const data = {
      client_id: 'NWmJN0x1jvOv3AWYOu3NAxCcRPCCiGN9',
      appid: 'quizify',
      deviceid: 'quizify',
      response_type: 'code',
      state: user.id // I would assume this is a bad idea, but ¯\_(ツ)_/¯
    }
    const url = `https://api.meethue.com/oauth2/auth?${querystring.stringify(data)}`

    return res.redirect(url)
  }

  @Get('callback')
  async callback (@Res() res, @Query() params) {
    const result = await this.hueService.login(params.code)
    console.log(result)
    const user = await this.userService.getById(params.state)
    await this.userService.setHueInfo(user.id, result.accessToken, result.refreshToken, result.username)

    return res.redirect(`${this.config.clientUrl}/hue`)
  }

  validateJwt(token: string) {
    try {
      return jwt.verify(token, this.config.jwtSecret)
    } catch (err) {
      console.log(err)
      throw new UserException('err')
    }
  }
}
