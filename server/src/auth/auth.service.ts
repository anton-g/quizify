import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/services/user.service';
import { User } from '../user/interfaces/user.interface';
import { ConfigService } from '../config/config.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService) {}

  async createToken(user: User) {
    const jwtdata: JwtPayload = { id: user.id };
    return jwt.sign(jwtdata, this.config.jwtSecret, { expiresIn: this.config.jwtExpiresIn });
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.userService.getById(payload.id);
  }
}
