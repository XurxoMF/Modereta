import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db/modereta.sqlite",
    logging: false,
    define: {
        freezeTableName: true,
    },
    models: [],
});

export const db = {
    sequelize,
};
