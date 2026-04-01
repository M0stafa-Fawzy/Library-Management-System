import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, Index } from "typeorm";
import { User } from "../user/user.entity";
import { Book } from "../book/book.entity";
import { BorrowingStatus } from "../common/enums/borrowing-transaction-status.enum";

@Entity('borrowing_transactions')
@Index(['borrowerId', 'bookId', 'status'])
export class BorrowingTransaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ type: 'int' })
    borrowerId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'borrowerId' })
    borrower: User;

    @Index()
    @Column({ type: 'int' })
    bookId: number;

    @ManyToOne(() => Book)
    @JoinColumn({ name: 'bookId' })
    book: Book;

    @CreateDateColumn()
    borrowDate: Date;

    @Index()
    @Column({ type: 'timestamp' })
    dueDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    returnDate: Date;

    @Index()
    @Column({ type: 'enum', enum: BorrowingStatus, default: BorrowingStatus.CHECKED_OUT })
    status: BorrowingStatus;
}