import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const statusCode = context.switchToHttp().getResponse().statusCode;
                return {
                    success: true,
                    statusCode,
                    data
                };
            })
        );
    }
}
