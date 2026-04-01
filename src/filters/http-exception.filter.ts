import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const isHttpException = exception instanceof HttpException;
        const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

        const message = status === 429 ? {
            statusCode: 429,
            message: 'Too Many Requests, Try again after a while',
            error: 'Too Many Requests',
        } : isHttpException ? exception.getResponse() : {
            statusCode: status,
            message: 'Internal server error',
            error: 'Internal Server Error',
        };

        console.error('Unhandled Exception:', exception);
        response.status(status).json(message);
    }
}
