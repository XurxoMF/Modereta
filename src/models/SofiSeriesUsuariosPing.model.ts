import { Table, Model, Column } from "sequelize-typescript";

export interface SofiSeriesUsuariosPingAttributes {
    idUsuario: string;
    ping: boolean;
}

@Table
export class SofiSeriesUsuariosPing extends Model<SofiSeriesUsuariosPingAttributes> {
    @Column({
        allowNull: false,
        unique: true,
    })
    declare idUsuario: string;

    @Column({
        allowNull: false,
    })
    declare ping: boolean;
}
