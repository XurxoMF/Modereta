import { Sequelize } from "sequelize-typescript";
import { PingCount } from "./PingCount.model";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db/modereta.sqlite",
    logging: false,
    define: {
        freezeTableName: true,
    },
    models: [PingCount],
});

export const db = {
    sequelize,
    PingCount,
};
