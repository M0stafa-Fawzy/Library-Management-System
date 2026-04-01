import { Module, NestModule, MiddlewareConsumer, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule)
    ],
    controllers: [UserController],
    providers: [UserRepository, UserService],
    exports: [UserRepository, UserService, TypeOrmModule]
})

export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(UserController)
    }
}
