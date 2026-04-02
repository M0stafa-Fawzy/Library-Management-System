import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { BookRepository } from "./book.repository";
import { CreateBookDto } from "./dtos/create-book.dto";
import { UpdateBookDto } from "./dtos/update-book.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginate } from "src/common/utils/paginate";
import { Not } from "typeorm";

@Injectable()
export class BookService {
    constructor(private readonly bookRepository: BookRepository) { }

    async create(data: CreateBookDto) {
        const existing = await this.bookRepository.findByQuery({ isbn: data.isbn });
        if (existing) throw new ConflictException('There is already a book with this ISBN');
        return this.bookRepository.create(data);
    }

    async findById(id: number) {
        const book = await this.bookRepository.findById(id);
        if (!book) throw new NotFoundException('Book not found');
        return book;
    }

    async findAll(search: string, pagination: PaginationDto) {
        const { data, total } = await this.bookRepository.findAll(search, pagination);
        return paginate(data, total, pagination);
    }

    async update(id: number, data: UpdateBookDto) {
        if (data.isbn) {
            const existing = await this.bookRepository.findByQuery({ isbn: data.isbn, id: Not(id) });
            if (existing) throw new ConflictException('There is already a book with this ISBN');
        }
        await this.bookRepository.update(id, data);
        return { message: 'Book updated successfully' };
    }

    async delete(id: number) {
        await this.bookRepository.delete(id);
        return { message: 'Book deleted successfully' };
    }
}
