import { Table, Model, Column } from "sequelize-typescript";

export interface SofiDropCountAttributes {
    id?: number;
    idUsuario: string;
    caducidad: number;
    createdAt?: Date;
    updatedAt?: Date;
}

@Table
export class SofiDropCount extends Model<SofiDropCountAttributes> {
    @Column({
        allowNull: false,
    })
    declare idUsuario: string;

    @Column({
        allowNull: false,
    })
    declare caducidad: number;
}
