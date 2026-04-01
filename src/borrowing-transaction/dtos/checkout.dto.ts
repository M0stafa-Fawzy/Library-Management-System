import { IsInt, IsPositive, IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CheckoutDto {
    @ApiProperty({ example: 1, description: 'ID of the book to check out' })
    @IsInt()
    @IsPositive()
    bookId: number;

    @ApiProperty({ example: '2026-03-31', description: 'Due date for the book' })
    @Type(() => Date)
    @IsDate()
    dueDate: Date;
}
