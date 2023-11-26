import { ApiProperty } from "@nestjs/swagger";

export class CreateTokenDto {
    @ApiProperty({
        example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJ1c2VyMUBtYWlsLnJ1IiwiaWF0IjoxNzAxMDA2NDk1LCJleHAiOjE3MDEwOTI4OTV9.FdMel5oCnEGp52YvRwUy_QcFKv_onSdjXcsBCLz3TFM",
        description: "Значение Refresh токена",
        nullable: false,
    })
    readonly refreshToken: string;
}
