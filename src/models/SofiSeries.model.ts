import { Table, Model, Column } from "sequelize-typescript";

export interface SofiSeriesAttributes {
    id?: number;
    serie: string;
    createdAt?: Date;
    updatedAt?: Date;
}

@Table({
    timestamps: false,
})
export class SofiSeries extends Model<SofiSeriesAttributes> {
    @Column({
        allowNull: false,
        unique: true,
    })
    declare serie: string;
}
