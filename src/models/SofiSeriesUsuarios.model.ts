import { Table, Model, Column } from "sequelize-typescript";

export interface SofiSeriesUsuariosAttributes {
    id?: number;
    idUsuario: string;
    serie: string;
    createdAt?: Date;
    updatedAt?: Date;
}

@Table
export class SofiSeriesUsuarios extends Model<SofiSeriesUsuariosAttributes> {
    @Column({
        allowNull: false,
    })
    declare idUsuario: string;

    @Column({
        allowNull: false,
    })
    declare serie: string;
}
