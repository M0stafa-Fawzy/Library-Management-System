import { IsEmail, IsString } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
    @ApiProperty({ example: 'mostafafawzzy471@gmail.com' })
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty({ example: 'MyStrongPassword123' })
    @IsString()
    password: string
}
