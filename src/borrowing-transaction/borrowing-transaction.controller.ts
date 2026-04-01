import { Controller, Post, Get, Body, Param, Query, Req, UseGuards, HttpCode, ParseIntPipe } from "@nestjs/common";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { BorrowingTransactionService } from "./borrowing-transaction.service";
import { CheckoutDto } from "./dtos/checkout.dto";
import { PaginationDto } from "../common/dtos/pagination.dto";
import { AuthGuard } from "../guards/auth.guard";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiTooManyRequestsResponse } from "@nestjs/swagger";
import { ProfileDecorator } from "src/decorators/profile.decorator";
import { User } from "../user/user.entity";

@ApiTags('Borrowing Transactions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('borrowings')
export class BorrowingTransactionController {
    constructor(private readonly borrowingService: BorrowingTransactionService) { }

    @Post()
    @Throttle({ default: { ttl: 60000, limit: 5 } }) // 5 requests per minute
    @UseGuards(ThrottlerGuard)
    @ApiOperation({ summary: 'Check out a book' })
    @ApiBody({ type: CheckoutDto })
    @ApiResponse({ status: 201, description: 'Book checked out successfully' })
    @ApiResponse({ status: 400, description: 'Book not available or already checked out' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Book not found' })
    @ApiTooManyRequestsResponse({ description: 'Rate limit exceeded (5 requests per minute)' })
    @HttpCode(201)
    checkout(@ProfileDecorator() user: User, @Body() data: CheckoutDto) {
        return this.borrowingService.checkout(user.id, data);
    }

    @Post('return/:id')
    @Throttle({ default: { ttl: 60000, limit: 5 } }) // 5 requests per minute
    @UseGuards(ThrottlerGuard)
    @ApiOperation({ summary: 'Return a book' })
    @ApiResponse({ status: 200, description: 'Book returned successfully' })
    @ApiResponse({ status: 400, description: 'Transaction does not belong to you or already returned' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Transaction not found' })
    @ApiTooManyRequestsResponse({ description: 'Rate limit exceeded (5 requests per minute)' })
    @HttpCode(200)
    return(@ProfileDecorator() user: User, @Param('id', ParseIntPipe) bookId: number) {
        return this.borrowingService.return(user.id, bookId);
    }

    @Get('my')
    @ApiOperation({ summary: 'List books currently checked out by the logged-in borrower' })
    @ApiResponse({ status: 200, description: 'Paginated list of currently borrowed books' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    myBorrowings(@ProfileDecorator() user: User, @Query() pagination: PaginationDto) {
        return this.borrowingService.myBorrowings(user.id, pagination);
    }

    @Get('my/current')
    @ApiOperation({ summary: 'List books currently checked out by the logged-in borrower' })
    @ApiResponse({ status: 200, description: 'Paginated list of currently borrowed books' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    myCurrentBorrowings(@ProfileDecorator() user: User, @Query() pagination: PaginationDto) {
        return this.borrowingService.myBorrowings(user.id, pagination, true);
    }

    @Get('overdue')
    @ApiOperation({ summary: 'List all overdue borrowing transactions' })
    @ApiResponse({ status: 200, description: 'Paginated list of overdue transactions' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    overdue(@Query() pagination: PaginationDto) {
        return this.borrowingService.overdue(pagination);
    }
}
