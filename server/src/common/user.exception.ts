import { HttpException } from "@nestjs/common";

export class UserException  {
  error: string;

  constructor (error: string) {
    this.error = error;
  }
}
