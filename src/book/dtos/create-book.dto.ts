import { IsString, IsNotEmpty, IsInt, Min, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBookDto {
    @ApiProperty({ example: 'My Book' })
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({ example: 'Mostafa Fawzy' })
    @IsString()
    @IsNotEmpty()
    author: string

    @ApiProperty({ example: '1234567890' })
    @IsString()
    isbn: string

    @ApiProperty({ example: 5 })
    @IsInt()
    @Min(0)
    availableQuantity: number

    @ApiProperty({ example: 'shelf1' })
    @IsString()
    @IsNotEmpty()
    shelfLocation: string
}
