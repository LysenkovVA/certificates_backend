import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import { File } from "../../files/entities/file.entity";
import { User } from "../../users/entity/users.entity";

interface IProfileCreationAttrs {}

@Table({
    tableName: "profiles",
})
export class Profile extends Model<Profile, IProfileCreationAttrs> {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
    })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({
        example: "Иванов",
        description: "Фамилия",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    surname: string;

    @ApiProperty({
        example: "Иван",
        description: "Имя",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name: string;

    @ApiProperty({
        example: "30.06.1993",
        description: "Дата рождения",
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    birthDate: Date;

    @BelongsTo(() => User, "userId")
    user: User;

    @BelongsTo(() => File, "fileId")
    avatar: File;
}
