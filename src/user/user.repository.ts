import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { SignUpDto } from "src/auth/dtos/signUp.dto";
import { PaginationDto } from "../common/dtos/pagination.dto"

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>) { }

    findByEmail(email: string) {
        return this.repo.findOne({
            where: { email },
            select: ['id', 'name', 'email', 'password', 'createdAt', 'updatedAt']
        });
    }

    findById(id: number) {
        return this.repo.findOne({ where: { id } });
    }

    async create(data: SignUpDto) {
        const user = this.repo.create(data);
        const saved = await this.repo.save(user);
        const { password, ...result } = saved;
        return result;
    }

    async findAll(pagination: PaginationDto) {
        const [data, total] = await this.repo.findAndCount({
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
            order: { createdAt: 'DESC' }
        });
        return { data, total };
    }

    update(id: number, data: Partial<User>) {
        return this.repo.update(id, data);
    }

    delete(id: number) {
        return this.repo.delete(id);
    }
}
