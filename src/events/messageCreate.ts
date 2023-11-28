import {
    Attachment,
    EmbedAssetData,
    EmbedBuilder,
    Events,
    Guild,
    GuildMember,
    Message,
    WebhookClient,
} from "discord.js";
import { MClient } from "../helpers/MClient";
import {
    DEV,
    CLIENT_ID_DEV,
    CLIENT_ID_PROD,
    WH_DEV,
    WH_NIVELES,
    DEV_ID,
    WH_SOFI_TOP_DROPS,
    GUILD_ID,
} from "../config.json";
import { buscarUsuariosPorSeries } from "../helpers/SofiSeriesUsuarios.helper";
import { checkEstado } from "../helpers/SofiSeriesUsuariosPing.helper";
import { incrementarXp, recompensar } from "../helpers/Niveles.helper";
import { anadirDrop, countDrops } from "../helpers/SofiDropCount.helper";
import { anadirSeries } from "../helpers/SofiSeries.helper";
const cooldowns = new Set();
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

        if (message.channel.id === "1101853797573206016" && message.author.id === sofiId && !DEV) {
            // Pings drops Sofi por actividad
            sofiPingDropActividad(message);
        }

        // Análisis de las series de Sofu y Nori para los pings de coleccionadas.
        if (message.author.id === noriId) {
            sofiDropController(mcli, message);
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

    if (embed.title === "SOFI: CAPTCHADROP") {
        message.reply({
            content: `<@&1096410227408121898> **Captcha Drop** disponible!`,
        });
    } else if (embed.title === "SOFI: MINIGAME") {
        message.reply({
            content: `<@&1096410227408121898> **Minijuego** desponible!`,
        });
    } else if (
        embed.description?.includes(
            "Cuando el temporizador se agote, se generarán **2** cartas aleatorias de la serie más votada!"
        )
    ) {
        message.reply({
            content: `<@&1096410227408121898> **Drop de Series** desponible!`,
        });
    }
};

const sofiDropController = async (mcli: MClient, message: Message): Promise<void> => {
    let series: string[] = [];
    let lineasTop: string[] = [];

    if (message.content.includes("❤️") || message.content.includes(":heart:")) {
        const lineas = message.content.split("\n");
        for (const linea of lineas) {
            let partes = linea.split("•");
            series.push(partes[partes.length - 1].trim());
        }
    }

    // Busca los usuarios en la base de datos y envía los pings
    if (series.length > 0) {
        // Añade las series a la base de datos de series de Sofi.
        await anadirSeries(mcli, series);

        const res = await buscarUsuariosPorSeries(mcli, series);
        const usuarios = [...res];
        const seriesUsuarios = new Map<string, Set<string>>();

        if (usuarios.length <= 0) return;

        let content = ``;

        for (const s of series) {
            let menciones: Set<string> = new Set();
            for (const u of usuarios) {
                if (u.getDataValue("serie").toLowerCase() === s.toLowerCase()) {
                    const id = u.getDataValue("idUsuario");
                    const drops = await countDrops(mcli, id);
                    const ping = await checkEstado(mcli, id);
                    if (drops >= 1) {
                        if (ping) {
                            menciones.add(`<@${id}>`);
                        } else {
                            let member = mcli.guilds.cache.get(GUILD_ID)?.members.cache.get(id);
                            if (member === undefined) {
                                // CONSUME API CALL, TENER CUIDADO
                                member = await (<Guild>(
                                    mcli.guilds.cache.get(GUILD_ID)
                                )).members.fetch(id);
                            }
                            menciones.add(`\`${member.displayName}\``);
                        }
                    }
                }
            }
            seriesUsuarios.set(s, menciones);
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
