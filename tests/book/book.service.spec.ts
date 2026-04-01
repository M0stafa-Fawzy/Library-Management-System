import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from '../../src/book/book.service';
import { BookRepository } from '../../src/book/book.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateBookDto } from '../../src/book/dtos/create-book.dto';
import { UpdateBookDto } from '../../src/book/dtos/update-book.dto';

const mockBook = {
    id: 1,
    title: 'Book 1',
    author: 'Mostafa Fawzy',
    isbn: '1234567890',
    availableQuantity: 15,
    shelfLocation: 'Shelf 101',
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockBookRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByQuery: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe('bookService', () => {
    let service: BookService;
    let repository: typeof mockBookRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookService,
                { provide: BookRepository, useValue: mockBookRepository },
            ],
        }).compile();

        service = module.get<BookService>(BookService);
        repository = module.get(BookRepository);

        jest.clearAllMocks();
    });

    describe('create', () => {
        const createDto: CreateBookDto = {
            title: 'Book 1',
            author: 'Mostafa Fawzy',
            isbn: '1234567890',
            availableQuantity: 15,
            shelfLocation: 'Shelf 101'
        };

        it('should create a book successfully', async () => {
            repository.findByQuery.mockResolvedValue(null);
            repository.create.mockResolvedValue(mockBook);

            const result = await service.create(createDto);

            expect(repository.findByQuery).toHaveBeenCalledWith({ isbn: createDto.isbn });
            expect(repository.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(mockBook);
        });
    });

    describe('findById', () => {
        it('should return a book by id', async () => {
            repository.findById.mockResolvedValue(mockBook);

            const result = await service.findById(1);

            expect(repository.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockBook);
        });

        it('should throw NotFoundException if book not found', async () => {
            repository.findById.mockResolvedValue(null);

            await expect(service.findById(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        const pagination = { page: 1, limit: 10 };

        it('should return paginated books', async () => {
            repository.findAll.mockResolvedValue({ data: [mockBook], total: 1 });

            const result = await service.findAll('', pagination);

            expect(repository.findAll).toHaveBeenCalledWith('', pagination);
            expect(result.data).toEqual([mockBook]);
            expect(result.meta.total).toBe(1);
            expect(result.meta.page).toBe(1);
            expect(result.meta.limit).toBe(10);
            expect(result.meta.totalPages).toBe(1);
            expect(result.meta.hasNextPage).toBe(false);
            expect(result.meta.hasPreviousPage).toBe(false);
        });

        it('should pass search term to repository', async () => {
            repository.findAll.mockResolvedValue({ data: [], total: 0 });

            await service.findAll('test', pagination);

            expect(repository.findAll).toHaveBeenCalledWith('test', pagination);
        });
    });

    describe('update', () => {
        const updateDto: UpdateBookDto = { title: 'Updated Title' };

        it('should update a book successfully', async () => {
            repository.findById.mockResolvedValue(mockBook);
            repository.update.mockResolvedValue({ affected: 1 });

            const result = await service.update(1, updateDto);

            expect(repository.findById).toHaveBeenCalledWith(1);
            expect(repository.update).toHaveBeenCalledWith(1, updateDto);
            expect(result).toEqual(mockBook);
        });

        it('should throw NotFoundException if book not found', async () => {
            repository.findById.mockResolvedValue(null);

            await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
            expect(repository.update).not.toHaveBeenCalled();
        });

        it('should allow update when ISBN belongs to the same book', async () => {
            const updateWithIsbn: UpdateBookDto = { isbn: '1234567890' };
            repository.findById.mockResolvedValue(mockBook);
            repository.findByQuery.mockResolvedValue(null);
            repository.update.mockResolvedValue({ affected: 1 });

            const result = await service.update(1, updateWithIsbn);

            expect(result).toEqual(mockBook);
        });
    });

    describe('delete', () => {
        it('should delete a book successfully', async () => {
            repository.findById.mockResolvedValue(mockBook);
            repository.delete.mockResolvedValue({ affected: 1 });

            const result = await service.delete(1);

            expect(repository.findById).toHaveBeenCalledWith(1);
            expect(repository.delete).toHaveBeenCalledWith(1);
            expect(result).toEqual({ message: 'Book deleted successfully' });
        });

        it('should throw NotFoundException if book not found', async () => {
            repository.findById.mockResolvedValue(null);

            await expect(service.delete(999)).rejects.toThrow(NotFoundException);
            expect(repository.delete).not.toHaveBeenCalled();
        });
    });
});
