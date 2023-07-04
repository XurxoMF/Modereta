import { Events, ActivityType, CommandInteraction } from "discord.js";
import { MClient } from "../helpers/MClient";

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(mcli: MClient, interaction: CommandInteraction) {
        // Test conexión Sequelize
        try {
            await mcli.db.sequelize.authenticate();
            console.log("🟢 ModeretaDB conectada con éxito!");
        } catch (error) {
            console.error("🔴 ModeretaDB no se pudo conectar:", error);
        }

        // Sicronización de tablas.
        try {
            await mcli.db.sequelize.sync();
            console.log("🟢 Tablas cargadas con éxito!");
        } catch (err) {
            console.error("🔴 Alguna tabla no se pudo (re)crear correctamente:", err);
        }

        // Log e estado :)
        console.log("🟢 Preparada! UwU");
        mcli.user?.setPresence({
            activities: [
                {
                    name: `todo en Astro Vaporwave!`,
                    type: ActivityType.Watching,
                },
            ],
        });
    },
};
