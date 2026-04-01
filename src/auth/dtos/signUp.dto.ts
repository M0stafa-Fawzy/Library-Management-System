import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignUpDto {
    @ApiProperty({ example: 'mostafafawzzy471@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'MyStrongPassword123', minLength: 6 })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string

    @ApiProperty({ example: 'Mostafa Fawzy' })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string
}
