import { ApiProperty } from "@nestjs/swagger";

export class CreateFileDto {
    @ApiProperty({
        example: "111.jpg",
        description: "Имя файла",
        required: true,
    })
    readonly name: string;

    @ApiProperty({
        example: "user123/certificates/",
        description: "Путь к файлу (статика)",
        required: true,
    })
    readonly path: string;

    @ApiProperty({
        example: "X-JPG",
        description: "Формат файла",
        required: true,
    })
    readonly format: string;

    @ApiProperty({
        example: "12347",
        description: "Размер файла в байтах",
        required: true,
    })
    readonly sizeAtBytes: number;
}
