import { Table, Model, Column } from "sequelize-typescript";

export interface NivelesAttributes {
    idUsuario: string;
    xp: number;
    nivel: number;
}

@Table
export class Niveles extends Model<NivelesAttributes> {
    @Column({
        allowNull: false,
        unique: true,
    })
    declare idUsuario: string;

    @Column({
        allowNull: false,
    })
    declare xp: number;

    @Column({
        allowNull: false,
    })
    declare nivel: number;
}
