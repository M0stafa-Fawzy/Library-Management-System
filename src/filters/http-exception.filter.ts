import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const isHttpException = exception instanceof HttpException;
        const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
        const message = isHttpException ? exception.getResponse() : {
            statusCode: status,
            message: 'Internal server error',
            error: 'Internal Server Error',
        };

        console.error('Unhandled Exception:', exception);
        response.status(status).json(message);
    }
}
