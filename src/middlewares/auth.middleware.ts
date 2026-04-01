import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../user/user.repository";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) throw new UnauthorizedException('No token provided');

        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.userRepository.findById(decoded.id);
            if (!user) throw new UnauthorizedException('User not found');
            req["id"] = user.id;
            req["user"] = user;
            next();
        } catch (err) {
            if (err instanceof UnauthorizedException) throw err;
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
