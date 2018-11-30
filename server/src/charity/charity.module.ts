import { Module } from "@nestjs/common";
import { CharityController } from "./charity.controller";

@Module({
  controllers: [
    CharityController
  ]
})
export class CharityModule { }
