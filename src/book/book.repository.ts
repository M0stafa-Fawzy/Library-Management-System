import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike, FindOptionsWhere } from "typeorm";
import { Book } from "./book.entity";
import { CreateBookDto } from "./dtos/create-book.dto";
import { UpdateBookDto } from "./dtos/update-book.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";

@Injectable()
export class BookRepository {
    constructor(@InjectRepository(Book) private readonly repo: Repository<Book>) { }

    create(data: CreateBookDto) {
        const book = this.repo.create(data);
        return this.repo.save(book);
    }

    findById(id: number) {
        return this.repo.findOne({ where: { id } });
    }

    findByQuery(query: FindOptionsWhere<Book>) {
        return this.repo.findOne({ where: query });
    }

    async findAll(search: string, pagination: PaginationDto) {
        const condition = search ? [
            { title: ILike(`%${search}%`) },
            { author: ILike(`%${search}%`) },
            { isbn: ILike(`%${search}%`) }
        ] : {};

        const [data, total] = await this.repo.findAndCount({
            where: condition,
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
            order: { createdAt: 'DESC' }
        });
        return { data, total }
    }

    update(id: number, data: UpdateBookDto) {
        return this.repo.update(id, data);
    }

    delete(id: number) {
        return this.repo.delete(id);
    }
}
