import { Table, Model, Column } from "sequelize-typescript";

export interface TablaAttributes {
    columna: string;
}

@Table
export class Tabla extends Model<TablaAttributes> {
    @Column
    declare columna: string;
}
