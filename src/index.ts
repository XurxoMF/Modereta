import fs from "node:fs";
import path from "node:path";
import { Collection, GatewayIntentBits } from "discord.js";
import { TOKEN_DEV, TOKEN_PROD, DEV } from "./config.json";
import {
    TipoComandos,
    ComandoBase,
    ComandoChatInput,
    ComandoMessageContextMenu,
    ComandoUserContextMenu,
} from "./types";
import { MClient } from "./helpers/MClient";
import { db } from "./models";

const intents = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent,
    ],
};

// Creción dun cliente
const mcli = new MClient(
    intents,
    new Collection(),
    new Collection(),
    new Collection(),
    new Collection(),
    db
);

mcli.rest.on("rateLimited", (info) =>
    console.log("🟡 Rate Limited | Información avanzada:\n", info)
);

// Importación de comandosChatImput
const rutaCarpetas = path.join(__dirname, "commands");
const carpetasComandos = fs.readdirSync(rutaCarpetas);

for (const carpeta of carpetasComandos) {
    const rutaComandos = path.join(rutaCarpetas, carpeta);
    const archivosComandos = fs.readdirSync(rutaComandos).filter((file) => file.endsWith(".ts"));
    for (const archivo of archivosComandos) {
        const rutaArchivo = path.join(rutaComandos, archivo);
        const comando: ComandoBase = require(rutaArchivo);
        if ("data" in comando && "execute" in comando) {
            switch (comando.tipo) {
                case TipoComandos.ChatInput:
                    mcli.comandosChatImput.set(comando.data.name, <ComandoChatInput>comando);
                    break;

                case TipoComandos.MessageContextMenu:
                    mcli.comandosMessageContextMenu.set(
                        comando.data.name,
                        <ComandoMessageContextMenu>comando
                    );
                    break;

                case TipoComandos.UserContextMenu:
                    mcli.comandosUserContextMenu.set(
                        comando.data.name,
                        <ComandoUserContextMenu>comando
                    );

                default:
                    break;
            }
        } else {
            console.log(`🟡 El comando en ${rutaArchivo} no contiene data o execute!`);
        }
    }
}

// Event handler
const rutaEventos = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(rutaEventos).filter((file) => file.endsWith(".ts"));

for (const file of eventFiles) {
    const filePath = path.join(rutaEventos, file);
    const event = require(filePath);
    if (event.once) {
        mcli.once(event.name, (...args) => event.execute(mcli, ...args));
    } else {
        mcli.on(event.name, (...args) => event.execute(mcli, ...args));
    }
}

// Conexión a Discord con token del cliente
mcli.login(DEV ? TOKEN_DEV : TOKEN_PROD);
