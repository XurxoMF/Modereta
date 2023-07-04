import { REST, Routes } from "discord.js";
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

const commands = [];

// Recoje todos los comandos de cada una de las carpetas
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());
            console.log(`🟢 Comando en ${filePath} cargado con éxito.`);
        } else {
            console.log(`🟡 El comando en ${filePath} no contiene data o execute!`);
        }
    }
}

const rest = new REST().setToken(<string>process.env.TOKEN);

// Deploy de los comandos
(async () => {
    try {
        // rest.delete(
        //     Routes.applicationGuildCommand(
        //         <string>process.env.CLIENT_ID,
        //         <string>process.env.GUILD_ID,
        //         "command-id"
        //     )
        // )
        //     .then(() => console.log("🟢 Se ha eliminado un comando con éxito!"))
        //     .catch(console.error);

        const data: any = await rest.put(
            Routes.applicationGuildCommands(
                <string>process.env.CLIENT_ID,
                <string>process.env.GUILD_ID
            ),
            {
                body: commands,
            }
        );
        console.log(`🟢 Refrscados con éxito ${data.length} comandos de aplicación (/)`);
    } catch (error) {
        console.error(error);
        console.log(`🔴 Ha ocurrido algún error durante el proceso de refresco de comandos!`);
    }
})();
