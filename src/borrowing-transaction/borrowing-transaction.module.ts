import { Module, NestModule, MiddlewareConsumer, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThrottlerModule } from "@nestjs/throttler";
import { BorrowingTransaction } from "./borrowing-transaction.entity";
import { BorrowingTransactionRepository } from "./borrowing-transaction.repository";
import { BorrowingTransactionService } from "./borrowing-transaction.service";
import { BorrowingTransactionController } from "./borrowing-transaction.controller";
import { BookModule } from "../book/book.module";
import { AuthModule } from "../auth/auth.module";
import { AuthMiddleware } from "../middlewares/auth.middleware";

@Module({
    imports: [
        TypeOrmModule.forFeature([BorrowingTransaction]),
        forwardRef(() => AuthModule),
        BookModule,
        ThrottlerModule.forRoot([{ ttl: 60000, limit: 5 }]) // 5 requests per min for the 2 APIs.
    ],
    controllers: [BorrowingTransactionController],
    providers: [BorrowingTransactionRepository, BorrowingTransactionService]
})
export class BorrowingTransactionModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(BorrowingTransactionController);
    }
}
