import { Module, HttpModule, forwardRef, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { HueService } from "./hue.service";
import { UserModule } from "../user/user.module";
import { CookieParserMiddleware } from "../common/cookie.middleware";
import { HueController } from "./hue.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
      HttpModule,
      forwardRef(() => UserModule)
    ],
    controllers: [
      HueController
    ],
    providers: [
      HueService
    ],
    exports: [
      HueService
    ]
})
export class HueModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieParserMiddleware)
      .forRoutes(HueController)
  }
}
