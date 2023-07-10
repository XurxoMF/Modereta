import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
} from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoChatInput } from "../../types";
import {
    AgregarSerieStatus,
    anadirSerie,
    EliminarSerieStatus,
    eliminarSerie,
    listaSeries,
} from "../../helpers/commands/sofi-series.helper";
import { Colores } from "../../data/general.data";
import { togle } from "../../helpers/db/SofiSeriesUsuariosPing.helper";

const exp: ComandoChatInput = {
    tipo: TipoComandos.ChatInput,
    data: new SlashCommandBuilder()
        .setName("sofi")
        .setDescription("Comandos relacionados con Sofi.")
        .addSubcommandGroup((sg) =>
            sg
                .setName("series")
                .setDescription(
                    "Comandos relacionados con la lista de series coleccionadas de Sofi."
                )
                .addSubcommand((s) =>
                    s
                        .setName("añadir")
                        .setDescription("Añade una serie a tu lista de series coleccionadas.")
                        .addStringOption((o) =>
                            o
                                .setName("serie")
                                .setDescription(
                                    `Serie que quieres añadir a tu lista. Copia el nombre de "ssl nombre-de-la-serie".`
                                )
                                .setRequired(true)
                        )
                )
                .addSubcommand((s) =>
                    s
                        .setName("eliminar")
                        .setDescription("Elimina una serie de tu lista de series coleccionadas.")
                        .addStringOption((o) =>
                            o
                                .setName("serie")
                                .setDescription(
                                    `Serie que quieres eliminar a tu lista. Copia el nombre de "/sofi series lista".`
                                )
                                .setRequired(true)
                        )
                )
                .addSubcommand((s) =>
                    s
                        .setName("lista")
                        .setDescription(
                            "Muestra tu listra de series coleccionadas o la de otro usuario."
                        )
                        .addUserOption((o) =>
                            o
                                .setName("usuario")
                                .setDescription(
                                    "Usuario del que quieres ver la lista de series coleccionadas."
                                )
                        )
                )
                .addSubcommand((s) =>
                    s
                        .setName("ping")
                        .setDescription(
                            "Activa o desactiva los pings cuando salga una serie que coleccionas."
                        )
                        .addBooleanOption((o) =>
                            o
                                .setName("activos")
                                .setDescription(
                                    "true si quieres que te haga ping o false si no quieres."
                                )
                                .setRequired(true)
                        )
                )
        ),
    async execute(mcli: MClient, interaction: ChatInputCommandInteraction) {
        const scg = interaction.options.getSubcommandGroup(true);
        const scn = interaction.options.getSubcommand(true);

        switch (scg) {
            case "series":
                switch (scn) {
                    case "añadir":
                        await seriesAnadirController(mcli, interaction);
                        break;

                    case "eliminar":
                        await seriesEliminarController(mcli, interaction);
                        break;

                    case "lista":
                        await seriesListaController(mcli, interaction);
                        break;

                    case "ping":
                        seriesPingController(mcli, interaction);
                        break;

                    default:
                        break;
                }
                break;
            default:
                break;
        }
    },
};

const seriesAnadirController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction
): Promise<void> => {
    const idUsuario = interaction.user.id;
    const serie = interaction.options.getString("serie", true);

    const status: AgregarSerieStatus = await anadirSerie(mcli, idUsuario, serie);

    let content = ``;

    if (status === AgregarSerieStatus.EXITO) {
        content = `> <@${idUsuario}> Se ha agregado **${serie}** a tu lista de series coleccionadas!`;
    } else if (status === AgregarSerieStatus.MAXIMO_SERIES) {
        content = `> Ya tienes 150 series en tu lista de series! Elimina alguna antes de añadir más.`;
    } else if (status === AgregarSerieStatus.NIVEL_INSUFICIENTE) {
        content = `> <@${idUsuario}> Solo puedes añadir **\`1\`** serie por nivel(máximo 150)! Usa **\`/nivel\`** en el canal <#741608890533412875> para ver tu nivel y experiencia.`;
    } else if (status === AgregarSerieStatus.SERIE_EXISTENTE) {
        content = `> <@${idUsuario}> La serie **${serie}** ya está en tu lista!`;
    }

    interaction.reply({
        content,
    });
};

const seriesEliminarController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction
): Promise<void> => {
    const idUsuario = interaction.user.id;
    const serie = interaction.options.getString("serie", true);

    const status = await eliminarSerie(mcli, idUsuario, serie);

    let content = ``;

    if (status === EliminarSerieStatus.EXITO) {
        content = `> <@${idUsuario}> Se ha eliminado la serie **${serie}** de tu lista de series coleccionadas!`;
    } else if (status === EliminarSerieStatus.SERIE_INEXISTENTE) {
        content = `> <@${idUsuario}> No existe esa serie en tu lista de series coleccionadas! Puedes verlas usando **\`/sofi series lista\`**.`;
    }

    await interaction.reply({
        content,
    });
};

const seriesListaController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction
): Promise<void> => {
    const usuario =
        interaction.options.getUser("usuario") !== null
            ? interaction.options.getUser("usuario", true)
            : interaction.user;
    const idUsuario = usuario.id;

    const series = await listaSeries(mcli, idUsuario);

    if (series.length <= 0) {
        if (interaction.user.id === idUsuario) {
            await interaction.reply({
                content: `> <@${idUsuario}> No tienes ninguna serie en tu lista de series coleccionadas! Usa **\`/sofi series añadir\`** para añadir una.`,
            });
        } else {
            await interaction.reply({
                content: `> <@${interaction.user.id}> Ese usuario no tiene ninguna serie en su lista de series coleccionadas!`,
            });
        }
    } else {
        const tamanoPagina: number = 10;
        const totalPaginas: number = Math.ceil(series.length / 10);
        let pagina: number = 1;

        let seriesPagina = getPaginaSeries(series, pagina, tamanoPagina);
        let desc = ``;

        for (const serie of seriesPagina) {
            desc += `> ${serie}\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`Series coleccionadas por ${usuario.username}`)
            .setDescription(desc)
            .setFooter({
                text: `Página ${pagina} de ${totalPaginas}`,
            })
            .setColor(Colores.EMBED_BASE);

        const avanzar = new ButtonBuilder()
            .setCustomId("avanzar")
            .setLabel(">")
            .setStyle(ButtonStyle.Primary);
        const retroceder = new ButtonBuilder()
            .setCustomId("retroceder")
            .setLabel("<")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        if (pagina >= totalPaginas) avanzar.setDisabled(true);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents([retroceder, avanzar]);

        const res = await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        const filter = (i: any) => i.user.id === interaction.user.id;

        const collector = res.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
            idle: 60_000,
        });

        collector.on("collect", async (i) => {
            const opcion = i.customId;

            if (opcion === "avanzar") {
                pagina += 1;
                if (totalPaginas <= pagina) avanzar.setDisabled(true);
                retroceder.setDisabled(false);
            } else if (opcion === "retroceder") {
                pagina -= 1;
                if (pagina <= 1) retroceder.setDisabled(true);
                avanzar.setDisabled(false);
            }

            seriesPagina = getPaginaSeries(series, pagina, tamanoPagina);
            desc = ``;

            for (const serie of seriesPagina) {
                desc += `> ${serie}\n`;
            }

            embed.setDescription(desc);
            embed.setFooter({ text: `Página ${pagina} de ${totalPaginas}` });

            i.update({
                embeds: [embed],
                components: [row],
            });
        });
    }
};

const seriesPingController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction
): Promise<void> => {
    const activo = interaction.options.getBoolean("activos", true);

    const estado = await togle(mcli, interaction.user.id, activo);

    interaction.reply({
        content: `> <@${
            interaction.user.id
        }> tus pings de drops de series de tu colección están ahora **${
            estado ? `activados` : `desactivados`
        }**!`,
    });
};

const getPaginaSeries = (series: string[], pagina: number, tamanoPagina: number): string[] => {
    const seriesPagina: string[] = [];

    for (let i = (pagina - 1) * tamanoPagina; i < tamanoPagina * pagina && i < series.length; i++) {
        seriesPagina.push(series[i]);
    }

    return seriesPagina;
};

module.exports = exp;
