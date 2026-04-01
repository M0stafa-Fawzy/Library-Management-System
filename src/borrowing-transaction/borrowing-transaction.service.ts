import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { BorrowingTransactionRepository } from "./borrowing-transaction.repository";
import { BookRepository } from "../book/book.repository";
import { CheckoutDto } from "./dtos/checkout.dto";
import { PaginationDto } from "../common/dtos/pagination.dto";
import { paginate } from "../common/utils/paginate";
import { Book } from "../book/book.entity";
import { BorrowingTransaction } from "./borrowing-transaction.entity";
import { BorrowingStatus } from "../common/enums/borrowing-transaction-status.enum";

@Injectable()
export class BorrowingTransactionService {
    constructor(
        private readonly transactionRepo: BorrowingTransactionRepository,
        private readonly bookRepo: BookRepository,
        private readonly dataSource: DataSource
    ) { }

    async checkout(borrowerId: number, data: CheckoutDto) {
        const book = await this.bookRepo.findById(data.bookId);
        if (!book) throw new NotFoundException('Book not found');

        if (book.availableQuantity <= 0) {
            throw new BadRequestException('Book is not available for checkout');
        }

        const activeCheckout = await this.transactionRepo.findActiveByBorrowerAndBook(borrowerId, data.bookId);
        if (activeCheckout) {
            throw new BadRequestException('You already have this book checked out');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.update(Book, book.id, { availableQuantity: book.availableQuantity - 1 });
            const transaction = queryRunner.manager.create(BorrowingTransaction, { borrowerId, ...data });
            const savedTransaction = await queryRunner.manager.save(transaction)
            await queryRunner.commitTransaction()
            return savedTransaction
        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw err
        } finally {
            await queryRunner.release()
        }
    }

    async return(borrowerId: number, bookId: number) {
        const transaction = await this.transactionRepo.findByIdAndBookId(borrowerId, bookId);
        if (!transaction) throw new NotFoundException('Borrowing transaction not found');
        if (transaction.status !== BorrowingStatus.CHECKED_OUT) {
            throw new BadRequestException('This book has already been returned');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.update(BorrowingTransaction, transaction.id, {
                status: BorrowingStatus.RETURNED,
                returnDate: new Date()
            });
            await queryRunner.manager.update(Book, bookId, {
                availableQuantity: transaction.book.availableQuantity + 1
            });
            await queryRunner.commitTransaction();
            return { message: 'Book returned successfully' };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async myBorrowings(borrowerId: number, pagination: PaginationDto, currentOnly: boolean = false) {
        const { data, total } = await this.transactionRepo.findMyBorrowings(borrowerId, pagination, currentOnly);
        return paginate(data, total, pagination);
    }

    async overdue(pagination: PaginationDto) {
        const { data, total } = await this.transactionRepo.findOverdueBorrowings(pagination);
        return paginate(data, total, pagination);
    }
}