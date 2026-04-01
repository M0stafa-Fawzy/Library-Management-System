import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 255 })
    title: string

    @Column({ type: 'varchar', length: 255 })
    author: string

    @Column({ type: 'varchar', length: 13, unique: true })
    isbn: string

    @Column({ type: 'int', default: 0 })
    availableQuantity: number

    @Column({ type: 'varchar', length: 255 })
    shelfLocation: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
