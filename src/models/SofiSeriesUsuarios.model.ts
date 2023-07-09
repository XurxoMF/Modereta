import { Table, Model, Column } from "sequelize-typescript";

export interface SofiSeriesUsuariosAttributes {
    idUsuario: string;
    serie: string;
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
