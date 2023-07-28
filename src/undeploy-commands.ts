import { REST, Routes } from "discord.js";
import { TOKEN_DEV, TOKEN_PROD, GUILD_ID, CLIENT_ID_DEV, CLIENT_ID_PROD, DEV } from "./config.json";

const rest = new REST().setToken(DEV ? TOKEN_DEV : TOKEN_PROD);

// Eliminación de todos los comandos
(async () => {
    try {
        const data: any = await rest.put(
            Routes.applicationGuildCommands(DEV ? CLIENT_ID_DEV : CLIENT_ID_PROD, GUILD_ID),
            {
                body: [],
            }
        );
        console.log(`🟢 Eliminados con éxito **todos** los comandos de aplicación (/)`);
    } catch (error) {
        console.error(error);
        console.log(`🔴 Ha ocurrido algún error durante el proceso de eliminación de comandos!`);
    }
})();
