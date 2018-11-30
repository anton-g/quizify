import { Controller, UseFilters, Get, HttpCode, UseGuards, Req, Query } from "@nestjs/common";
import { UserExceptionFilter } from "../common/user-exception.filter";
import { CharityDto } from "./dtos/charity.dto";

@Controller('charity')
@UseFilters(new UserExceptionFilter())
export class CharityController {
  constructor() {}

  @HttpCode(200)
  @Get('')
  async get (@Req() req): Promise<CharityDto[]> {
    const host = req.get('host')

    return [
      {
        name: 'UNICEF',
        link: 'https://support.unicef.org/donate/now',
        img: `//${host}/unicef.svg`
      },
      {
        name: 'The Red Cross',
        link: 'https://www.icrc.org/en/donate',
        img: `//${host}/icrc.svg`
      }
    ]
  }
}
