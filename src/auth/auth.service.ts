import { UserService } from '../user/user.service';
import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { SignUpDto } from "src/auth/dtos/signUp.dto";
import { compare } from 'bcrypt'
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    private generateToken(payload: { id: number }): string {
        return this.jwtService.sign(payload);
    }

    async signUp(data: SignUpDto) {
        const user = await this.userService.create(data)
        return {
            user, token: this.generateToken({ id: user.id })
        }
    }

    async login(data: LoginDto) {
        const user = await this.userRepository.findByEmail(data.email)
        if (!user) throw new BadRequestException('Invalid email or password')

        const isPasswordMatch = await compare(data.password, user.password)
        if (!isPasswordMatch) throw new BadRequestException('Invalid email or password')

        return {
            user, token: this.generateToken({ id: user.id })
        }
    }

    getProfile(id: number) {
        return this.userRepository.findById(id)
    }
}
