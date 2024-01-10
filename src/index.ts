import fs from "node:fs";
import path from "node:path";
import {
    Collection,
    EmbedBuilder,
    GatewayIntentBits,
    GuildMember,
    WebhookClient,
} from "discord.js";
import {
    TOKEN_DEV,
    TOKEN_PROD,
    DEV,
    DEV_ID,
    GUILD_ID,
    CLIENT_ID_DEV,
    CLIENT_ID_PROD,
    DNS,
    DNS_CONTRASENA,
    DNS_USUARIO,
    DNS_HOST,
    DNS_WH,
} from "./config.json";
import {
    TipoComandos,
    ComandoBase,
    ComandoChatInput,
    ComandoMessageContextMenu,
    ComandoUserContextMenu,
} from "./types";
import { MClient } from "./helpers/MClient";
import { db } from "./models";
import { desmutear, getMuteosActivosTerminados } from "./helpers/Muteos.helper";
import { wait } from "./helpers/Generales.helper";
import { eliminarCaducados } from "./helpers/SofiDropCount.helper";
import https from "node:https";

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

let ipActual = "0";

setInterval(async () => {
    // Autoeliminación de muteos.
    const muteos = await getMuteosActivosTerminados(mcli);
    muteos.forEach(async (muteo) => {
        const guild = mcli.guilds.cache.get(GUILD_ID);
        const member = guild?.members.cache.get(muteo.idUsuario);
        if (member !== undefined) {
            const modereta = <GuildMember>(
                guild?.members.cache.get(DEV ? CLIENT_ID_DEV : CLIENT_ID_PROD)
            );
            desmutear(mcli, member, "Terminado el timepo de muteo.", modereta);
        } else {
            await muteo.update({ muteado: false });
        }
        await wait(1000);
    });

    // Autoeliminación de drops de Sofi caducados.
    eliminarCaducados(mcli);

    if (DNS) {
        const wh = new WebhookClient({ url: DNS_WH });

        const req = https.get({ host: "api.ipify.org", path: "/" }, (res) => {
            res.on("data", (ip) => {
                ip = Buffer.from(ip).toString("utf-8");

                if (ip !== ipActual) {
                    const req = https.get(
                        {
                            host: "dondns.dondominio.com",
                            path: `/json/?user=${DNS_USUARIO}&password=${DNS_CONTRASENA}&host=${DNS_HOST}&ip=${ip}`,
                            method: "GET",
                        },
                        (res) => {
                            res.on("data", (data) => {
                                data = Buffer.from(data).toString("utf-8");

                                try {
                                    const jsonData = JSON.parse(data);

                                    const embed = new EmbedBuilder().setTimestamp(Date.now());

                                    if (jsonData.success) {
                                        embed
                                            .setTitle("IP DNS CAMBIADA!!!")
                                            .setDescription(
                                                `- **IP Anterior:** ${ipActual}\n- **IP Nueva:** ${ip}`
                                            )
                                            .setColor("#ffe208");

                                        ipActual = ip;
                                    } else {
                                        embed
                                            .setTitle("NO SE HA PODIDO CAMBIAR LA IP!!!")
                                            .setDescription(
                                                `- **IP Anterior:** ${ipActual}\n- **IP Nueva:** ${ip}`
                                            )
                                            .setColor("#fc0303");
                                    }

                                    wh.send({ content: `<@${DEV_ID}>`, embeds: [embed] });
                                } catch (error) {
                                    console.error("🟡 Error al parsear el JSON del cambio de IP!");
                                }
                            });
                        }
                    );

                    req.on("error", (error) => {
                        const embed = new EmbedBuilder()
                            .setTitle("ERROR AL CAMBIAR IP!!!")
                            .setDescription(`- **IP Anterior:** ${ipActual}\n- **IP Nueva:** ${ip}`)
                            .setTimestamp(Date.now())
                            .setColor("#fc0303");
                        wh.send({ content: `<@${DEV_ID}>`, embeds: [embed] });
                    });

                    req.end();
                }
            });
        });

        req.on("error", (error) => {
            console.log("🟡 Error al detectar la nueva IP!");
        });

        req.end();
    }
}, 60_000);

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
