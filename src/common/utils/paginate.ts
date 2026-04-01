import { PaginationDto } from "../dtos/pagination.dto";

export interface PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export function paginate<T>(data: T[], total: number, pagination: PaginationDto): PaginatedResult<T> {
    const totalPages = Math.ceil(total / pagination.limit);
    return {
        data,
        meta: {
            total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages,
            hasNextPage: pagination.page < totalPages,
            hasPreviousPage: pagination.page > 1
        }
    };
}
