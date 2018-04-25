import { ExceptionFilter, Catch } from '@nestjs/common';
import { UserException } from './user.exception';

@Catch(UserException)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception, response) {
    response
      .status(200)
      .json({
        statusCode: 200,
        error: exception.error,
      });
  }
}
