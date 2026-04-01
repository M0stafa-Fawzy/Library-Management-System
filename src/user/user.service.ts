import { ConflictException, Injectable } from "@nestjs/common";
import { SignUpDto } from "src/auth/dtos/signUp.dto";
import { UserRepository } from "./user.repository";
import { PaginationDto } from "../common/dtos/pagination.dto"

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async create(data: SignUpDto) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) throw new ConflictException('Email already exists');

        return this.userRepository.create(data);
    }

    async getAll(pagination: PaginationDto) {
        return this.userRepository.findAll(pagination);
    }
}
