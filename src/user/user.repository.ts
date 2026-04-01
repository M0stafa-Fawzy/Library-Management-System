import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { SignUpDto } from "src/auth/dtos/signUp.dto";
import { Role } from "src/common/enums/role.enum";
import { PaginationDto } from "../common/dtos/pagination.dto"

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>) { }

    findByEmail(email: string) {
        return this.repo.findOne({
            where: { email },
            select: ['id', 'name', 'email', 'password', 'role', 'createdAt', 'updatedAt']
        });
    }

    findById(id: number) {
        return this.repo.findOne({ where: { id } });
    }

    create(data: SignUpDto) {
        const user = this.repo.create(data);
        return this.repo.save(user);
    }

    findAll(pagination: PaginationDto) {
        return this.repo.find({
            where: { role: Role.USER },
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit
        });
    }
}
