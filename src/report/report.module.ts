import { Module, NestModule, MiddlewareConsumer, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowingTransaction } from '../borrowing-transaction/borrowing-transaction.entity';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from '../middlewares/auth.middleware';

@Module({
    imports: [
        TypeOrmModule.forFeature([BorrowingTransaction]),
        forwardRef(() => AuthModule),
    ],
    controllers: [ReportController],
    providers: [ReportService],
})
export class ReportModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(ReportController);
    }
}
