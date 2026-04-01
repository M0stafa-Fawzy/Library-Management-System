import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) throw new UnauthorizedException('No token provided');

        try {
            const decoded = this.jwtService.verify(token);
            req["id"] = decoded.id
            next();
        } catch (err) {
            console.error('Invalid token', err.message);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
