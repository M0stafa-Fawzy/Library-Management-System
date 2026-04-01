import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { BorrowingTransaction } from "./borrowing-transaction.entity";
import { BorrowingStatus } from "../common/enums/borrowing-transaction-status.enum";
import { PaginationDto } from "../common/dtos/pagination.dto";
import { CheckoutDto } from "./dtos/checkout.dto";

@Injectable()
export class BorrowingTransactionRepository {
    constructor(
        @InjectRepository(BorrowingTransaction)
        private readonly repo: Repository<BorrowingTransaction>
    ) { }

    create(borrowerId: number, data: CheckoutDto) {
        const transaction = this.repo.create({ borrowerId, ...data });
        return this.repo.save(transaction);
    }

    findById(id: number) {
        return this.repo.findOne({ where: { id }, relations: ['book', 'borrower'] });
    }

    findByIdAndBookId(borrowerId: number, bookId: number) {
        return this.repo.findOne({
            where: { borrowerId, bookId },
            relations: ['book'],
            order: { borrowDate: 'DESC' }
        });
    }

    findByIdAndBorrowerId(id: number, borrowerId: number) {
        return this.repo.findOne({
            where: { id, borrowerId },
            relations: ['book', 'borrower'],
            order: { borrowDate: 'DESC' }
        });
    }

    findActiveByBorrowerAndBook(borrowerId: number, bookId: number) {
        return this.repo.findOne({
            where: { borrowerId, bookId, status: BorrowingStatus.CHECKED_OUT }
        });
    }

    async findMyBorrowings(borrowerId: number, pagination: PaginationDto, currentOnly: boolean = false) {
        const [data, total] = await this.repo.findAndCount({
            where: {
                borrowerId,
                ...(currentOnly ? { status: BorrowingStatus.CHECKED_OUT } : {})
            },
            relations: ['book'],
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
            order: { borrowDate: 'DESC' }
        });
        return { data, total };
    }

    async findOverdueBorrowings(pagination: PaginationDto) {
        const [data, total] = await this.repo.findAndCount({
            where: {
                status: BorrowingStatus.CHECKED_OUT,
                dueDate: LessThan(new Date())
            },
            relations: ['book', 'borrower'],
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
            order: { dueDate: 'ASC' }
        });
        return { data, total };
    }

    async markReturned(id: number) {
        return this.repo.update(id, {
            status: BorrowingStatus.RETURNED,
            returnDate: new Date()
        });
    }
}
