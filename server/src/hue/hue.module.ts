import { Module, HttpModule, forwardRef } from "@nestjs/common";
import { HueService } from "./hue.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
      HttpModule,
      forwardRef(() => UserModule)
    ],
    providers: [
      HueService
    ],
    exports: [
      HueService
    ]
})
export class HueModule { }
