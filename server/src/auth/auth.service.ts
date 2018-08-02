import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/services/user.service';
import { User } from '../user/interfaces/user.interface';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService) {}

  async createToken(user: User) {
    const jwtdata = { id: user.id };
    return jwt.sign(jwtdata, this.config.jwtSecret, { expiresIn: this.config.jwtExpiresIn });
  }

  async validateUser(payload: any): Promise<any> {
    return await this.userService.getById(payload.id);
  }
}
