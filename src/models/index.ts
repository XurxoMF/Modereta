import { Sequelize } from "sequelize-typescript";
import { SofiSeriesUsuarios } from "./SofiSeriesUsuarios.model";
import { Niveles } from "./Niveles.model";
import { SofiSeriesUsuariosPing } from "./SofiSeriesUsuariosPing.model";
import { Advertencias } from "./Advertencias.model";
import { Notas } from "./Notas.model";
import { Muteos } from "./Muteos.model";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db/modereta.sqlite",
    logging: false,
    define: {
        freezeTableName: true,
    },
    models: [SofiSeriesUsuarios, Niveles, SofiSeriesUsuariosPing, Advertencias, Notas, Muteos],
});

export const db = {
    sequelize,
    SofiSeriesUsuarios,
    Niveles,
    SofiSeriesUsuariosPing,
    Advertencias,
    Notas,
    Muteos,
};
