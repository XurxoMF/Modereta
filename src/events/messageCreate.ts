import { Events, GuildBasedChannel, GuildMember, Message } from "discord.js";
import { MClient } from "../helpers/MClient";
import {
    DEV,
    CLIENT_ID_DEV,
    CLIENT_ID_PROD,
    NIVELES_ID_DEV,
    NIVELES_ID_PROD,
} from "../config.json";
import { buscarTodoPorSerie } from "../helpers/SofiSeriesUsuarios.helper";
import { buscarTodos } from "../helpers/SofiSeriesUsuariosPing.helper";
import { SubirNivelStatus, subirNivel } from "../helpers/Niveles.helper";
const cooldowns = new Set();

module.exports = {
    name: Events.MessageCreate,
    async execute(mcli: MClient, message: Message) {
        // Si el mensaje es del propio bot cancelamos todo.
        if (message.author.id === (DEV ? CLIENT_ID_DEV : CLIENT_ID_PROD)) return;

        // Análisis de las series de Sofu y Nori para los pings de coleccionadas.
        if (
            // 950166445034188820
            message.author.id === "950166445034188820" ||
            // 742070928111960155
            message.author.id === "742070928111960155"
        ) {
            sofiSeriesDropController(mcli, message);
        }

        // Karuta ping de drops
        if (
            message.author.id === "646937666251915264" &&
            message.content.includes("I'm dropping 3 cards since this server is currently active!")
        ) {
            message.reply({ content: "<@&1096463668977336383> Karuta está dropeando cartas!" });
        }

        // Niveles
        if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;
        nivelesController(mcli, message);
    },
};

const sofiSeriesDropController = async (mcli: MClient, message: Message): Promise<void> => {
    let series: string[] = [];

    // Búsca las series en los mensajes de los bots.
    if (
        // 950166445034188820
        message.author.id === "950166445034188820" &&
        message.content.includes(", we've found the following cards for you")
    ) {
        // drop normal SOFU
        const frases = message.content.split("\n");
        for (let i = 1; i < frases.length; i++) {
            series.push(frases[i].split(" • ")[2].slice(1, -1));
        }
        //742070928111960155
    } else if (message.author.id === "742070928111960155") {
        if (
            (message.content.includes("1]") && message.content.includes(":heart:")) ||
            message.content.includes("❤️")
        ) {
            // ping de drop de Sofi
            message.channel.send({
                content: `<@&${"1096410227408121898"}> Sofi está dropeando por actividad!!`,
            });
        }

        if (
            message.content.includes("**") &&
            message.content.startsWith("`1]`") &&
            message.content.includes("ɢ")
        ) {
            // drop de char-serie por actividade
            const lineas = message.content.split("\n");
            for (const linea of lineas) {
                series.push(linea.split("•")[4].trim());
            }
        } else if (
            message.content.includes("**") &&
            message.content.startsWith("`1]`") &&
            !message.content.includes("ɢ")
        ) {
            // drop de char-serie por actividade sin g
            const lineas = message.content.split("\n");
            for (const linea of lineas) {
                series.push(linea.split("•")[3].trim());
            }
        } else if (!message.content.includes("**") && message.content.startsWith("`1]`")) {
            // drop de serie por actividade
            const lineas = message.content.split("\n");
            for (const linea of lineas) {
                series.push(linea.split("•")[2].trim());
            }
        }
    }

    // Busca los usuarios en la base de datos, procesa, envía los pings y gestiona el botón de interacción.
    if (series.length > 0) {
        const res = await buscarTodoPorSerie(mcli, series);
        const ping = await buscarTodos(mcli);
        const users = [...res];

        // envía pings as persoas cas series na súa lista
        if (users.length > 0) {
            const userSeries: any = {};
            let content = ``;

            for (const s of series) {
                userSeries[s] = [];
                for (const u of users) {
                    const id = u.getDataValue("idUsuario");

                    if (
                        u.getDataValue("serie").toLowerCase() === s.toLowerCase() &&
                        ping.find((pre) => pre.getDataValue("idUsuario") === id)
                    ) {
                        userSeries[s].push(u.getDataValue("idUsuario"));
                    }
                }
            }

            for (const serie in userSeries) {
                if (userSeries[serie].length > 0) {
                    content += `## ${serie}\n> `;
                    for (const id of userSeries[serie]) {
                        content += `<@${id}>, `;
                    }
                    content = content.slice(0, -2);
                    content += `\n`;
                }
            }

            if (content.length > 0) {
                await message.reply({
                    content: content,
                });
            }
        }
    }
};

const nivelesController = async (mcli: MClient, message: Message): Promise<void> => {
    const res = await subirNivel(mcli, (<GuildMember>message.member).id, message);

    if (res.estado === SubirNivelStatus.NIVEL) {
        const canal = <GuildBasedChannel>(
            message.guild?.channels.cache.get(DEV ? NIVELES_ID_DEV : NIVELES_ID_PROD)
        );

        if (canal.isTextBased()) {
            canal.send({
                content: `<@${message.author.id}> ya eres nivel **${res.nivel}**! Enhorabuena!`,
            });
        }
    }

    cooldowns.add(message.author.id);
    setTimeout(() => {
        cooldowns.delete(message.author.id);
    }, 30_000);
};
