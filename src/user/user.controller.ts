import { Controller, Get, Query, Post, Body, UseGuards, HttpCode } from "@nestjs/common";
import { UserService } from "./user.service";
import { PaginationDto } from "../common/dtos/pagination.dto";
import { SignUpDto } from "src/auth/dtos/signUp.dto";
import { Role } from "src/common/enums/role.enum";
import { Roles } from "src/decorators/roles.decorator";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post("/admins")
    @ApiOperation({ summary: 'Create a new admin user' })
    @ApiBody({ type: SignUpDto })
    @ApiResponse({ status: 201, description: 'Admin user created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @HttpCode(201)
    create(@Body() data: SignUpDto) {
        return this.userService.create({ ...data, role: Role.ADMIN });
    }

    @Get()
    @ApiOperation({ summary: 'Get all users with pagination' })
    @ApiResponse({ status: 200, description: 'Paginated list of users' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    getAll(@Query() pagination: PaginationDto) {
        return this.userService.getAll(pagination);
    }

}