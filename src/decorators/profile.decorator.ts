import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const ProfileDecorator = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        return req.user;
    }
)
