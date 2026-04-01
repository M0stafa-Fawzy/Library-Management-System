import { AuthService } from './../auth/auth.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class ProfileInterceptor implements NestInterceptor {
    constructor(private readonly authService: AuthService) { }
    async intercept(context: ExecutionContext, next: CallHandler) {
        let req = context.switchToHttp().getRequest()
        let user = await this.authService.getProfile(req.id)
        req.user = user
        return next.handle()
    }
}
