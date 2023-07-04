import fs from "node:fs";
import path from "node:path";
import { Collection, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { Comando } from "./types";
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
const mcli = new MClient(intents, new Collection(), new Collection(), db);

mcli.rest.on("rateLimited", (info) => console.log("rate limited", info));

// Importación de comandos
const rutaCarpetas = path.join(__dirname, "commands");
const carpetasComandos = fs.readdirSync(rutaCarpetas);

for (const carpeta of carpetasComandos) {
    const rutaComandos = path.join(rutaCarpetas, carpeta);
    const archivosComandos = fs.readdirSync(rutaComandos).filter((file) => file.endsWith(".ts"));
    for (const archivo of archivosComandos) {
        const rutaArchivo = path.join(rutaComandos, archivo);
        const comando = require(rutaArchivo);
        // Establece un novo item na colección de comandos con key = nome e value = módulo exportado
        if ("data" in comando && "execute" in comando) {
            mcli.comandos.set(comando.data.name, <Comando>comando);
        } else {
            console.log(`🟡 El comando en ${rutaArchivo} no contiene data o execute!`);
        }
    }
}

// Importación de eventos
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

// Conexión a Discord co token do cliente
mcli.login(<string>process.env.TOKEN);
