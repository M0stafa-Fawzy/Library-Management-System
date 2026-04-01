import { IsEmail, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'Mostafa Fawzy' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string

    @ApiPropertyOptional({ example: 'newemail@gmail.com' })
    @IsOptional()
    @IsEmail()
    email?: string
}
