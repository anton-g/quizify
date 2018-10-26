import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';

@Injectable()
export class EventAuthGuard implements CanActivate {
  constructor (private readonly config: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const data = context.switchToWs().getData()
    const token = data.authorization

    if (!token) {
      return false
    }

    try {
      const payload = jwt.verify(token, this.config.jwtSecret)
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
