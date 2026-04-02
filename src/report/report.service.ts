import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { BorrowingTransaction } from '../borrowing-transaction/borrowing-transaction.entity';
import { BorrowingStatus } from '../common/enums/borrowing-transaction-status.enum';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(BorrowingTransaction)
        private readonly borrowingRepo: Repository<BorrowingTransaction>
    ) { }

    async getSummary() {
        const counts = await this.borrowingRepo.createQueryBuilder('t')
            .select('t.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('t.status')
            .getRawMany();

        const active = +(counts.find(c => c.status === BorrowingStatus.CHECKED_OUT)?.count || 0);
        const returned = +(counts.find(c => c.status === BorrowingStatus.RETURNED)?.count || 0);
        const total = active + returned;

        const overdue = await this.borrowingRepo.createQueryBuilder('t')
            .where('t.status = :status', { status: BorrowingStatus.CHECKED_OUT })
            .andWhere('t.dueDate < NOW()')
            .getCount();

        return `total,active,returned,overdue\n${total},${active},${returned},${overdue}`;
    }

    async getOverdueLastMonth() {
        const records = await this.borrowingRepo.find({
            where: { status: BorrowingStatus.CHECKED_OUT, dueDate: Between(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()) },
            relations: ['book', 'borrower'],
            order: { dueDate: 'ASC' }
        });
        return this.buildCsv(records);
    }

    async getBorrowingsLastMonth() {
        const records = await this.borrowingRepo.find({
            where: { borrowDate: Between(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()) },
            relations: ['book', 'borrower'],
            order: { borrowDate: 'DESC' }
        });
        return this.buildCsv(records);
    }

    private buildCsv(records: BorrowingTransaction[]) {
        const header = 'id,borrower,email,book,isbn,borrow_date,due_date,return_date,status';
        const rows = records.map(r => [
            r.id,
            `"${r.borrower?.name || ''}"`,
            `"${r.borrower?.email || ''}"`,
            `"${r.book?.title || ''}"`,
            `"${r.book?.isbn || ''}"`,
            r.borrowDate?.toISOString() || '',
            r.dueDate?.toISOString() || '',
            r.returnDate?.toISOString() || '',
            r.status
        ].join(','));

        return [header, ...rows].join('\n');
    }
}
