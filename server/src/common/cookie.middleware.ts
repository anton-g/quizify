// From https://github.com/wbhob/nest-middlewares
import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

@Injectable()
export class CookieParserMiddleware implements NestMiddleware {
    public static configure(secret: string | string[], opts?: cookieParser.CookieParseOptions) {
        this.secret = secret;
        if (opts) {
            this.options = opts;
        }
    }

    private static secret: string | string[];
    private static options: cookieParser.CookieParseOptions;

    public resolve(...args: any[]): MiddlewareFunction {
        if (CookieParserMiddleware.secret) {
            return cookieParser(CookieParserMiddleware.secret, CookieParserMiddleware.options);
        } else {
            return cookieParser();
        }
    }
}
