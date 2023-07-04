import { Table, Model, Column } from "sequelize-typescript";

export interface PingCountAttributes {
    userId: string;
    usos: number;
}

@Table
export class PingCount extends Model<PingCountAttributes> {
    @Column
    declare userId: string;

    @Column
    declare usos: number;
}
