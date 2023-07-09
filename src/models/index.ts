import { Sequelize } from "sequelize-typescript";
import { SofiSeriesUsuarios } from "./SofiSeriesUsuarios.model";
import { Niveles } from "./Niveles.model";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db/modereta.sqlite",
    logging: false,
    define: {
        freezeTableName: true,
    },
    models: [SofiSeriesUsuarios, Niveles],
});

export const db = {
    sequelize,
    SofiSeriesUsuarios,
    Niveles,
};
