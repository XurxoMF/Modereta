import { Table, Model, Column } from "sequelize-typescript";

export interface AdvertenciasAttributes {
    id?: number;
    idUsuario: string;
    razon: string;
}

@Table
export class Advertencias extends Model<AdvertenciasAttributes> {
    @Column({
        allowNull: false,
    })
    declare idUsuario: string;

    @Column({
        allowNull: false,
    })
    declare razon: string;
}
