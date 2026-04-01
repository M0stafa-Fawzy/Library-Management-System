import { Exclude } from "class-transformer"
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import * as bcrypt from 'bcrypt'
import { Role } from "src/common/enums/role.enum"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 255 })
    name: string

    @Column({ unique: true, type: 'varchar', length: 255 })
    email: string

    @Column({ select: false })
    @Exclude()
    password: string

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt(8);
        this.password = await bcrypt.hash(this.password, salt);
    }
}
