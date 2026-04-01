import { Expose, Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class UserProfileResponse {
    @ApiProperty({ example: 1 })
    id: number

    @ApiProperty({ example: 'Mostafa Fawzy' })
    name: string

    @ApiProperty({ example: 'mostafafawzzy471@gmail.com' })
    email: string
}

export class UserDto {
    @ApiProperty({ type: UserProfileResponse })
    @Transform(({ obj }) => {
        return {
            id: obj.user.id,
            name: obj.user.name,
            email: obj.user.email
        }
    })
    @Expose()
    user: UserProfileResponse

    @ApiProperty({})
    @Expose()
    token: string
}
