import { Table, Model, Column } from "sequelize-typescript";

export interface MuteosAttributes {
    id?: number;
    idUsuario: string;
    roles: string;
    muteado: boolean;
    motivo: string;
    fin: number;
    createdAt?: Date;
    updatedAt?: Date;
}

@Table
export class Muteos extends Model<MuteosAttributes> {
    @Column({
        allowNull: false,
    })
    declare idUsuario: string;

    @Column
    declare roles: string;

    @Column({
        allowNull: false,
    })
    declare muteado: boolean;

    @Column
    declare motivo: string;

    @Column
    declare fin: number;
}
