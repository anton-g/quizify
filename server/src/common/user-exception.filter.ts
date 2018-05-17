import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { UserException } from './user.exception';

@Catch(UserException)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: UserException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    response
      .status(200)
      .json({
        statusCode: 200,
        error: exception.error,
      });
  }
}
