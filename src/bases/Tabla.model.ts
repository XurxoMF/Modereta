import { Table, Model, Column } from "sequelize-typescript";

export interface TablaAttributes {
    id?: number;
    columna: string;
    createdAt?: Date;
    updatedAt?: Date;
}

@Table({})
export class Tabla extends Model<TablaAttributes> {
    @Column({})
    declare columna: string;
}
