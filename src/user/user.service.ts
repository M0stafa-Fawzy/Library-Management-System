import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { SignUpDto } from "src/auth/dtos/signUp.dto";
import { UpdateProfileDto } from "src/auth/dtos/update-profile.dto";
import { UserRepository } from "./user.repository";
import { PaginationDto } from "../common/dtos/pagination.dto";
import { paginate } from "src/common/utils/paginate";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async create(data: SignUpDto) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) throw new ConflictException('Email already exists');

        return this.userRepository.create(data);
    }

    async findById(id: number) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundException('Borrower not found');
        return user;
    }

    async getAll(pagination: PaginationDto) {
        const { data, total } = await this.userRepository.findAll(pagination);
        return paginate(data, total, pagination);
    }

    async update(id: number, data: UpdateProfileDto) {
        const borrower = await this.findById(id);

        if (data.email && data.email !== borrower.email) {
            const existing = await this.userRepository.findByEmail(data.email);
            if (existing) throw new ConflictException('Email already exists');
        }

        await this.userRepository.update(id, data);
        return { message: 'Borrower updated successfully' };
    }

    async delete(id: number) {
        await this.userRepository.delete(id);
        return { message: 'Borrower deleted successfully' };
    }
}
