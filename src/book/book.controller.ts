import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, ParseIntPipe } from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dtos/create-book.dto";
import { UpdateBookDto } from "./dtos/update-book.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags('Books')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Post()
    @ApiOperation({ summary: 'Add a new book' })
    @ApiBody({ type: CreateBookDto })
    @ApiResponse({ status: 201, description: 'Book created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'ISBN already exists' })
    @HttpCode(201)
    create(@Body() data: CreateBookDto) {
        return this.bookService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'List all books with pagination and search' })
    @ApiResponse({ status: 200, description: 'Paginated list of books' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    findAll(@Query('search') search: string, @Query() pagination: PaginationDto) {
        return this.bookService.findAll(search, pagination);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a book by ID' })
    @ApiResponse({ status: 200, description: 'Book details' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Book not found' })
    @HttpCode(200)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a book' })
    @ApiBody({ type: UpdateBookDto })
    @ApiResponse({ status: 200, description: 'Book updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Book not found' })
    @ApiResponse({ status: 409, description: 'ISBN already exists' })
    @HttpCode(200)
    update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateBookDto) {
        return this.bookService.update(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a book' })
    @ApiResponse({ status: 200, description: 'Book deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Book not found' })
    @HttpCode(200)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.delete(id);
    }
}
