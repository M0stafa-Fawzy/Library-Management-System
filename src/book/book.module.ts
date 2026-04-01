import { Module, NestModule, MiddlewareConsumer, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "./book.entity";
import { BookRepository } from "./book.repository";
import { BookService } from "./book.service";
import { BookController } from "./book.controller";
import { AuthModule } from "src/auth/auth.module";
import { AuthMiddleware } from "src/middlewares/auth.middleware";

@Module({
    imports: [
        TypeOrmModule.forFeature([Book]),
        forwardRef(() => AuthModule)
    ],
    controllers: [BookController],
    providers: [BookRepository, BookService],
    exports: [BookService]
})
export class BookModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(BookController)
    }
}
