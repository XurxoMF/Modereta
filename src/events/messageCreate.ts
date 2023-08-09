import { Events, GuildBasedChannel, GuildMember, Message, WebhookClient } from "discord.js";
import { MClient } from "../helpers/MClient";
import { DEV, CLIENT_ID_DEV, CLIENT_ID_PROD, WH_DEV, WH_NIVELES, DEV_ID } from "../config.json";
import { buscarUsuariosPorSeries } from "../helpers/SofiSeriesUsuarios.helper";
import { buscarTodos, checkEstado } from "../helpers/SofiSeriesUsuariosPing.helper";
import { incrementarXp, recompensar } from "../helpers/Niveles.helper";
import { anadirDrop, countDrops } from "../helpers/SofiDropCount.helper";
const cooldowns = new Set();
const sofuId = DEV ? DEV_ID : "950166445034188820";
const noriId = DEV ? DEV_ID : "742070928111960155";
const sofiId = "853629533855809596";

module.exports = {
    name: Events.MessageCreate,
    async execute(mcli: MClient, message: Message) {
        // Si el mensaje es del propio bot cancelamos todo.
        if (message.author.id === (DEV ? CLIENT_ID_DEV : CLIENT_ID_PROD)) return;

        if (message.author.id === sofiId && message.content.includes("is dropping the cards")) {
            const palabras = message.content.split(" ");
            const id = palabras[0].slice(2, -1);

            await anadirDrop(mcli, id);
        }

        if (
            message.channel.id === "1101853797573206016" &&
            message.author.id === "853629533855809596"
        ) {
            // Pings drops Sofi por actividad
            sofiPingDropActividad(message);
        }

        // Análisis de las series de Sofu y Nori para los pings de coleccionadas.
        if (message.author.id === sofuId || message.author.id === noriId) {
            sofiSeriesDropController(mcli, message);
        }

        // Karuta ping de drops
        if (
            message.author.id === "646937666251915264" &&
            message.content.includes("I'm dropping 3 cards since this server is currently active!")
        ) {
            message.reply({ content: "<@&1096463668977336383> Karuta está dropeando cartas!" });
        }

        if (DEV && message.author.id !== DEV_ID) return;

        // Niveles
        if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;
        nivelesController(mcli, message);
    },
};

const sofiPingDropActividad = (message: Message): void => {
    const embed = message.embeds.length >= 1 ? message.embeds[0] : undefined;

    if (embed === undefined) return;

    if (embed.title === "Captcha Drop") {
        message.reply({
            content: `<@&1096410227408121898> **Captcha Drop** disponible!`,
        });
    } else if (embed.title === "SOFI: MINIGAME") {
        message.reply({
            content: `<@&1096410227408121898> **Minijuego** desponible!`,
        });
    } else if (embed.description?.includes("I will drop cards from the most voted series")) {
        message.reply({
            content: `<@&1096410227408121898> **Drop de Series** desponible!`,
        });
    }
};

const sofiSeriesDropController = async (mcli: MClient, message: Message): Promise<void> => {
    let series: string[] = [];

    // Búsca las series en los mensajes de los bots.
    if (message.author.id === sofuId && message.content.includes("has dropeado estas cartas!")) {
        const frases = message.content.split("\n");
        for (const frase of frases) {
            if (frase.startsWith("> ")) {
                series.push(frase.split(" • ")[2]);
            }
        }
    } else if (message.author.id === noriId) {
        if (
            message.content.includes("**") &&
            message.content.startsWith("`1]`") &&
            message.content.includes("ɢ")
        ) {
            // drop formato char-serie por actividade
            const lineas = message.content.split("\n");
            for (const linea of lineas) {
                series.push(linea.split("•")[4].trim());
            }
        } else if (
            message.content.includes("**") &&
            message.content.startsWith("`1]`") &&
            !message.content.includes("ɢ")
        ) {
            // drop formato char-serie por actividade sin g
            const lineas = message.content.split("\n");
            for (const linea of lineas) {
                series.push(linea.split("•")[3].trim());
            }
        } else if (!message.content.includes("**") && message.content.startsWith("`1]`")) {
            // drop formato serie por actividade
            const lineas = message.content.split("\n");
            for (const linea of lineas) {
                series.push(linea.split("•")[2].trim());
            }
        }
    }

    // Busca los usuarios en la base de datos y envía los pings
    if (series.length > 0) {
        const res = await buscarUsuariosPorSeries(mcli, series);
        const users = [...res];
        const seriesUsuarios = new Map<string, Set<string>>();

        if (users.length <= 0) return;

        let content = ``;

        for (const s of series) {
            let ids: Set<string> = new Set();
            for (const u of users) {
                if (u.getDataValue("serie").toLowerCase() === s.toLowerCase()) {
                    const id = u.getDataValue("idUsuario");
                    const drops = await countDrops(mcli, id);
                    const ping = await checkEstado(mcli, id);
                    if (drops >= 1 && ping) {
                        ids.add(`<@${id}>`);
                    }
                }
            }
            seriesUsuarios.set(s, ids);
        }

        for (const su of seriesUsuarios) {
            if (su[1].size > 0) {
                content += `**${su[0]}**\n> ${[...su[1]].join(`, `)}\n`;
            }
        }

        if (content.length > 0) {
            await message.reply({
                content: content,
            });
        }
    }
};

const nivelesController = async (mcli: MClient, message: Message): Promise<void> => {
    const member = <GuildMember>message.member;

    const nivel = await incrementarXp(mcli, member.id);

    cooldowns.add(message.author.id);
    setTimeout(() => {
        cooldowns.delete(message.author.id);
    }, 30_000);

    if (nivel === -1) return;

    await recompensar(member, nivel);

    await new WebhookClient({ url: DEV ? WH_DEV : WH_NIVELES }).send({
        content: `> <@${member.id}> ya eres nivel ${nivel}! Enhorabuena!`,
    });
};
