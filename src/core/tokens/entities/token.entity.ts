import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import { User } from "../../users/entity/users.entity";

interface ITokenCreationAttrs {
    refreshToken: string;
}

@Table({
    tableName: "tokens",
    createdAt: false,
    updatedAt: false,
})
export class Token extends Model<Token, ITokenCreationAttrs> {
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
        example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJ1c2VyMUBtYWlsLnJ1IiwiaWF0IjoxNzAxMDA2NDk1LCJleHAiOjE3MDEwOTI4OTV9.FdMel5oCnEGp52YvRwUy_QcFKv_onSdjXcsBCLz3TFM",
        description: "Значение Refresh токена",
    })
    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    refreshToken: string;

    @BelongsTo(() => User, "userId")
    user: User;
}
