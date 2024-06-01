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
import { buscarUsuariosPorInicioSerie } from "../../helpers/SofiSeriesUsuarios.helper";
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
        let mostrados = false;
        let comas = true;
        let propias = true;

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

        const btnAlternarCodigos = new ButtonBuilder()
            .setCustomId(`alternar_codigos_button_${messageId}`)
            .setLabel("Mostrar Códigos")
            .setStyle(ButtonStyle.Success);

        const btnAlternarPropias = new ButtonBuilder()
            .setCustomId(`alternar_propias_button_${messageId}`)
            .setLabel("Ocultar Coleccionadas")
            .setStyle(ButtonStyle.Success);

        const btnCancelar = new ButtonBuilder()
            .setCustomId(`cancelar_button_${messageId}`)
            .setLabel("Cancelar")
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            btnAlternarCodigos,
            btnAlternarPropias,
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
                } que coleccionan algunas de las cartas mostradas!\nSigue pasando las páginas de la colección para actualizar la lista.\n\n- **\`Quitar/Añadir Comas\`** - Quita o añade las comas entre los códigos.\n- **\`Ocultar/Mostrar Coleccionadas\`** - Oculta o muestra los códigos de las cartas que TU coleccionas de la lista de cartas coleccionadas de los otros usuarios.\n Esto es útil para no confundirse y darle una de tus cartas a otra persona.\n- **\`Cancelar\`** - Cancela la búsqueda de cartas. Recomendable usar este botón al terminar para no tener a Modereta ocupada durante 30 minutos.`
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
                    } que coleccionan algunas de las cartas mostradas!\nSigue pasando las páginas de la colección para actualizar la lista.\n\n- **\`Quitar/Añadir Comas\`** - Quita o añade las comas entre los códigos.\n- **\`Ocultar/Mostrar Coleccionadas\`** - Oculta o muestra los códigos de las cartas que TU coleccionas de la lista de cartas coleccionadas de los otros usuarios.\n Esto es útil para no confundirse y darle una de tus cartas a otra persona.\n- **\`Cancelar\`** - Cancela la búsqueda de cartas. Recomendable usar este botón al terminar para no tener a Modereta ocupada durante 30 minutos.`
                );
                try {
                    btnAlternarCodigos.setLabel("Mostrar Códigos");

                    await respuesta.edit({
                        embeds: [embedRespuesta],
                        components: [row],
                    });
                } catch (err) {}
            }
        };

        // Evento activado al pulsar el botón de mostrar resultados.
        const handleButtonInteraction = async (buttonInteraction: Interaction) => {
            if (!buttonInteraction.isButton() || buttonInteraction.user.id !== interaction.user.id)
                return;

            if (buttonInteraction.customId === `alternar_codigos_button_${messageId}`) {
                usadoEn.delete(messageId);

                if (mostrados) {
                    comas = !comas;
                    if (comas) {
                        btnAlternarCodigos.setLabel("Quitar Comas");
                    } else {
                        btnAlternarCodigos.setLabel("Añadir Comas");
                    }
                } else {
                    btnAlternarCodigos.setLabel("Quitar Comas");
                    mostrados = true;
                }

                const respuestas = await formatearRespuesta(
                    contRes,
                    interaction.user.id,
                    comas,
                    propias
                );

                await buttonInteraction.update({ embeds: [...respuestas], components: [row] });
            }

            if (buttonInteraction.customId === `alternar_propias_button_${messageId}`) {
                usadoEn.delete(messageId);

                propias = !propias;
                if (propias) {
                    btnAlternarPropias.setLabel("Ocultar Coleccionadas");
                } else {
                    btnAlternarPropias.setLabel("Mostrar Coleccionadas");
                }

                const respuestas = await formatearRespuesta(
                    contRes,
                    interaction.user.id,
                    comas,
                    propias
                );

                await buttonInteraction.update({ embeds: [...respuestas], components: [row] });
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
    idExec: string,
    comas: boolean,
    propias: boolean
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
        if (propias) {
            nueva = `<@${idUsuario}>\n\`\`\`${Array.from(respuesta[idUsuario]).join(
                comas ? ", " : " "
            )}\`\`\`\n`;
        } else {
            if (idUsuario === idExec) {
                nueva = `<@${idUsuario}>\n\`\`\`${Array.from(respuesta[idUsuario]).join(
                    comas ? ", " : " "
                )}\`\`\`\n`;
            } else {
                if (respuesta[idExec]) {
                    const codesPropias = Array.from(respuesta[idExec]);
                    let codes: string[] = [];

                    codes.push(
                        ...Array.from(respuesta[idUsuario]).filter(
                            (value) => !codesPropias.includes(value)
                        )
                    );

                    if (codes.length > 0) {
                        nueva = `<@${idUsuario}>\n\`\`\`${codes.join(comas ? ", " : " ")}\`\`\`\n`;
                    } else {
                        nueva = ``;
                    }
                } else {
                    nueva = `<@${idUsuario}>\n\`\`\`${Array.from(respuesta[idUsuario]).join(
                        comas ? ", " : " "
                    )}\`\`\`\n`;
                }
            }
        }

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
