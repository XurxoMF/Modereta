import { Table, Model, Column } from "sequelize-typescript";

export interface NotasAttributes {
    id?: number;
    idUsuario: string;
    nota: string;
    idAutor: string;
    createdAt?: Date;
    updatedAt?: Date;
}

@Table
export class Notas extends Model<NotasAttributes> {
    @Column({
        allowNull: false,
    })
    declare idUsuario: string;

    @Column({
        allowNull: false,
    })
    declare nota: string;

    @Column({
        allowNull: false,
    })
    declare idAutor: string;
}
