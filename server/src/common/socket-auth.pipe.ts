import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import * as jwt from 'jsonwebtoken'
import { ConfigService } from '../config/config.service';

@Injectable()
export class SocketAuthPipe implements PipeTransform<any, Promise<any>> {
  constructor (
    private readonly userService: UserService,
    private readonly config: ConfigService) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    try {
      const payload: any = jwt.verify(value.data.authorization, this.config.jwtSecret)
      delete value.data.authorization
      value.user = await this.userService.getById(payload.id)
    } catch (err) {
      console.log(err)
    }

    return value
  }
}
