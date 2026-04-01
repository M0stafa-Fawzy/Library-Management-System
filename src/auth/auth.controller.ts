import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "src/auth/dtos/signUp.dto";
import { LoginDto } from "src/auth/dtos/login.dto"
import { Serialize } from "src/interceptors/serialize.interceptor";
import { UserDto } from "src/auth/dtos/user.dto";
import { ProfileDecorator } from "src/decorators/profile.decorator";
import { User } from "src/user/user.entity";
import { AuthGuard } from "src/guards/auth.guard";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/signup")
    @ApiOperation({ summary: 'Register a new borrower' })
    @ApiBody({ type: SignUpDto })
    @ApiResponse({ status: 201, description: 'Borrower registered successfully', type: UserDto })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    @Serialize(UserDto)
    @HttpCode(201)
    signUp(@Body() data: SignUpDto) {
        return this.authService.signUp(data)
    }

    @Post("/login")
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Login successful', type: UserDto })
    @ApiResponse({ status: 400, description: 'Invalid email or password' })
    @HttpCode(200)
    @Serialize(UserDto)
    login(@Body() data: LoginDto) {
        return this.authService.login(data)
    }

    @Get("/profile")
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Current user profile' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(AuthGuard)
    @HttpCode(200)
    getProfile(@ProfileDecorator() user: User) {
        return user
    }
}
