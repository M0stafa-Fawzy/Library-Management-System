import { Controller, Get, Put, Delete, Query, Body, Param, UseGuards, HttpCode, ParseIntPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { PaginationDto } from "../common/dtos/pagination.dto";
import { UpdateProfileDto } from "src/auth/dtos/update-profile.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { ProfileDecorator } from "src/decorators/profile.decorator";
import { User } from "./user.entity";

@ApiTags('Borrowers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('borrowers')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @ApiOperation({ summary: 'List all borrowers' })
    @ApiResponse({ status: 200, description: 'Paginated list of borrowers' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    getAll(@Query() pagination: PaginationDto) {
        return this.userService.getAll(pagination);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a borrower by ID' })
    @ApiResponse({ status: 200, description: 'Borrower details' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Borrower not found' })
    @HttpCode(200)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findById(id);
    }

    @Put('profile')
    @ApiOperation({ summary: 'Update your own profile' })
    @ApiBody({ type: UpdateProfileDto })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    @HttpCode(200)
    update(@ProfileDecorator() user: User, @Body() data: UpdateProfileDto) {
        return this.userService.update(user.id, data);
    }

    @Delete('profile')
    @ApiOperation({ summary: 'Delete your own profile' })
    @ApiResponse({ status: 200, description: 'Profile deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    delete(@ProfileDecorator() user: User) {
        return this.userService.delete(user.id);
    }
}