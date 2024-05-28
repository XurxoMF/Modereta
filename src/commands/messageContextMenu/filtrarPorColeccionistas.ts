import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    MessageContextMenuCommandInteraction,
    Message,
    PartialMessage,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    Interaction,
    Embed,
    EmbedBuilder,
} from "discord.js";
import { MClient } from "../../helpers/MClient";
import {
    buscarUsuariosPorInicioSerie,
    buscarUsuariosPorSerie,
} from "../../helpers/SofiSeriesUsuarios.helper";
import { TipoComandos, ComandoMessageContextMenu } from "../../types";
import { Colores } from "../../data/general.data";

const usadoEn = new Set<string>();

const exp: ComandoMessageContextMenu = {
    tipo: TipoComandos.MessageContextMenu,
    data: new ContextMenuCommandBuilder()
        .setName("Filtrar Por Coleccionista")
        .setType(ApplicationCommandType.Message),
    async execute(mcli: MClient, interaction: MessageContextMenuCommandInteraction) {
        let contRes: { [key: string]: Set<string> } = {};

        const message = interaction.targetMessage;

        if (message.embeds.length === 0) {
            return await interaction.reply({
                content: `> <@${interaction.user.id}> Ese mensaje no muestra la colección de Sofi de ningún usuario.`,
                ephemeral: true,
            });
        }

        let embed = message.embeds[0];

        if (!embed.title?.startsWith("SOFI: COLLECTION")) {
            return await interaction.reply({
                content: `> <@${interaction.user.id}> Ese mensaje no muestra la colección de Sofi de ningún usuario.`,
                ephemeral: true,
            });
        }

        if (!embed.description?.split("\n")[0].split(" • ")[2].trim().startsWith("`")) {
            return await interaction.reply({
                content: `> <@${interaction.user.id}> La colecciión mostrada en ese mensaje no está ordenada por Serie, Nombre, Gen, Wishlist, Tag o Nivel.\n> Usa el desplegable debajo de la colección para ordenarla y usa el comando de nuevo.`,
                ephemeral: true,
            });
        }

        // Comprobar y/o añadir el id del mensaje a la lista de mensajes ya analizado para evitar que se analice el mismo mensaje varias veces.
        const messageId = message.id;
        if (usadoEn.has(messageId)) {
            return await interaction.reply({
                content:
                    "> Ya se está analizando el contenido de este mensaje! Espera 30 minutos o cancela el análisis anterior para poder usarlo de nuevo.",
                ephemeral: true,
            });
        }
        usadoEn.add(messageId);

        await actualizarCodigos(mcli, embed, contRes, interaction);

        const btnMostrarCodigos = new ButtonBuilder()
            .setCustomId(`mostrar_codigos_button_${messageId}`)
            .setLabel("Códigos")
            .setStyle(ButtonStyle.Success);

        const btnMostrarCodigosNoComas = new ButtonBuilder()
            .setCustomId(`mostrar_codigos_nocomas_button_${messageId}`)
            .setLabel("Códigos Sin Comas")
            .setStyle(ButtonStyle.Success);

        const btnCancelar = new ButtonBuilder()
            .setCustomId(`cancelar_button_${messageId}`)
            .setLabel("Cancelar")
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            btnMostrarCodigos,
            btnMostrarCodigosNoComas,
            btnCancelar
        );

        let embedRespuesta = new EmbedBuilder()
            .setTitle(`BUSQUEDA DE COLECCIONISTAS`)
            .setColor(Colores.EMBED_BASE)
            .setDescription(
                `Se ${
                    Object.keys(contRes).length === 1
                        ? "encontró **1** usuario"
                        : `encontraron **${Object.keys(contRes).length}** usuarios`
                } que coleccionan algunas de las cartas mostradas!\nSigue pasando las páginas de la colección para actualizar la lista.\n\nCuando termines y quieras ver los resultados pulsa el botón \`${
                    btnMostrarCodigos.data.label
                }\`.`
            )
            .setFooter({
                text: "El botón dejará de funcionar a los 30 minutos de usar el comando así que no tardes demasiado!",
            });

        const respuesta = await interaction.reply({
            embeds: [embedRespuesta],
            components: [row],
        });

        // Evento activado al cambiar el contenido del mensaje.
        const handleMessageUpdate = async (
            oldMessage: Message<boolean> | PartialMessage,
            newMessage: Message<boolean> | PartialMessage
        ) => {
            if (
                newMessage.id === messageId &&
                !oldMessage.embeds.every((embed, i) => embed.equals(newMessage.embeds[i]))
            ) {
                let nuevoEmbed = newMessage.embeds[0];
                await actualizarCodigos(mcli, nuevoEmbed, contRes, interaction);
                embedRespuesta.setDescription(
                    `Se ${
                        Object.keys(contRes).length === 1
                            ? "encontró **1** usuario"
                            : `encontraron **${Object.keys(contRes).length}** usuarios`
                    } que coleccionan algunas de las cartas mostradas!\nSigue pasando las páginas de la colección para actualizar la lista.\n\nCuando termines y quieras ver los resultados pulsa el botón \`${
                        btnMostrarCodigos.data.label
                    }\`.`
                );
                try {
                    await respuesta.edit({
                        embeds: [embedRespuesta],
                    });
                } catch (err) {}
            }
        };

        // Evento activado al pulsar el botón de mostrar resultados.
        const handleButtonInteraction = async (buttonInteraction: Interaction) => {
            if (!buttonInteraction.isButton() || buttonInteraction.user.id !== interaction.user.id)
                return;

            if (buttonInteraction.customId === `mostrar_codigos_button_${messageId}`) {
                usadoEn.delete(messageId);

                const respuestas = await formatearRespuesta(contRes, true);

                await buttonInteraction.update({ embeds: [...respuestas] });
            }

            if (buttonInteraction.customId === `mostrar_codigos_nocomas_button_${messageId}`) {
                usadoEn.delete(messageId);

                const respuestas = await formatearRespuesta(contRes, false);

                await buttonInteraction.update({ embeds: [...respuestas] });
            }

            if (buttonInteraction.customId === `cancelar_button_${messageId}`) {
                mcli.off("messageUpdate", handleMessageUpdate);
                mcli.off("interactionCreate", handleButtonInteraction);
                usadoEn.delete(messageId);

                let respuesta = new EmbedBuilder()
                    .setTitle(`BUSQUEDA DE COLECCIONISTAS`)
                    .setColor(Colores.MUTEOS)
                    .setDescription(`Búsqueda cancelada.`);

                await buttonInteraction.update({ embeds: [respuesta], components: [] });
            }
        };

        // Inciar eventos para que el comando funcione y elimine eventos de forma automática.
        mcli.on("messageUpdate", handleMessageUpdate);
        mcli.on("interactionCreate", handleButtonInteraction);

        // Eliminar eventos al pasar 30 minutos si siguen activos.
        setTimeout(() => {
            mcli.off("messageUpdate", handleMessageUpdate);
            mcli.off("interactionCreate", handleButtonInteraction);
            usadoEn.delete(messageId);
        }, 1_800_000);
    },
};

const actualizarCodigos = async (
    mcli: MClient,
    embed: Embed,
    contRes: { [key: string]: Set<string> },
    interaction: MessageContextMenuCommandInteraction
) => {
    let cartas = embed.description?.split("\n");

    if (!cartas) return;

    for (const carta of cartas) {
        let partes = carta.split(" • ");
        let serie = partes[partes.length - 1].trim().slice(1, -1);
        let codigo = partes[2].trim().split(" ")[0].slice(1, -1).trim();

        const idsUsuarios = await buscarUsuariosPorInicioSerie(mcli, serie);

        for (const idUsuario of idsUsuarios) {
            let estaNoServer = true;

            try {
                let user = await interaction.guild?.members.fetch(idUsuario);
                if (user === undefined) estaNoServer = false;
            } catch (err) {
                estaNoServer = false;
            }

            if (estaNoServer) {
                if (!contRes[idUsuario]) {
                    contRes[idUsuario] = new Set<string>();
                }
                contRes[idUsuario].add(codigo);
            }
        }
    }
};

const formatearRespuesta = async (
    respuesta: {
        [key: string]: Set<string>;
    },
    comas: boolean
): Promise<EmbedBuilder[]> => {
    let mensajes: string[] = [];
    let nueva = "";
    let nuevoChunk = "";
    let formateada = "";
    const embed = new EmbedBuilder()
        .setTitle(`SIN RESULTADOS`)
        .setColor(Colores.MUTEOS)
        .setDescription("Nadie colecciona ninguna de las series de esa colección.")
        .setFooter({
            text: "Los resultados pueden no ser 100% exactos al no poder verse la serie completa en la colección.",
        });
    const embeds = [];

    if (Object.keys(respuesta).length === 0) {
        return [embed];
    }

    for (const idUsuario in respuesta) {
        nueva = `<@${idUsuario}>\n\`\`\`${Array.from(respuesta[idUsuario]).join(
            comas ? ", " : " "
        )}\`\`\`\n`;
        nuevoChunk = formateada + nueva;

        if (nuevoChunk.length >= 4000) {
            mensajes.push(formateada);
            formateada = "";
        }

        formateada += nueva;
    }

    mensajes.push(formateada);

    let iteracion = 1;
    for (const mensaje of mensajes) {
        embed
            .setTitle(`RESULTADOS DE LA BÚSQUEDA | ${iteracion++}`)
            .setColor(Colores.SANCION_ELIMINADA)
            .setDescription(mensaje);
        embeds.push(embed);
    }

    return embeds;
};

module.exports = exp;
