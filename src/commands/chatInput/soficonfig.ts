import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    PermissionFlagsBits,
} from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoChatInput } from "../../types";
import {
    anadirSeries,
    buscarLikeTodasLasSeries,
    eliminarSerie,
} from "../../helpers/SofiSeries.helper";

const exp: ComandoChatInput = {
    tipo: TipoComandos.ChatInput,
    data: new SlashCommandBuilder()
        .setName("soficonfig")
        .setDescription("Configuración relacionada con Sofi.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommandGroup((sg) =>
            sg
                .setName("series")
                .setDescription("Configura aspectos relacionados con las series de Sofi.")
                .addSubcommand((s) =>
                    s
                        .setName("eliminar")
                        .setDescription("Elimina una serie de la lista de Series de Sofi.")
                        .addStringOption((o) =>
                            o
                                .setName("serie")
                                .setDescription(`Serie que quieres eliminar de la lista.`)
                                .setRequired(true)
                                .setAutocomplete(true)
                        )
                )
                .addSubcommand((s) =>
                    s
                        .setName("añadir")
                        .setDescription("Añade una serie de la lista de Series de Sofi.")
                        .addStringOption((o) =>
                            o
                                .setName("serie")
                                .setDescription(`Serie que quieres añadir de la lista.`)
                                .setRequired(true)
                        )
                )
        ),
    async autocompletado(mcli: MClient, interaction: AutocompleteInteraction) {
        const opcion = interaction.options.getFocused(true);
        const subg = interaction.options.getSubcommandGroup();
        const sub = interaction.options.getSubcommand();

        switch (subg) {
            case "series":
                switch (sub) {
                    case "eliminar":
                        if (opcion.name === "serie") {
                            const series = await buscarLikeTodasLasSeries(mcli, opcion.value);
                            await interaction.respond(
                                series.map((serie) => ({ name: `"${serie}"`, value: serie }))
                            );
                        }
                        break;

                    default:
                        break;
                }
                break;

            default:
                break;
        }
    },
    async execute(mcli: MClient, interaction: ChatInputCommandInteraction) {
        const scg = interaction.options.getSubcommandGroup(true);
        const scn = interaction.options.getSubcommand(true);

        switch (scg) {
            case "series":
                switch (scn) {
                    case "eliminar":
                        await seriesEliminarController(mcli, interaction);
                        break;

                    case "añadir":
                        await seriesAñadirController(mcli, interaction);
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

const seriesEliminarController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction
) => {
    const serie = interaction.options.getString("serie", true);
    const estado = await eliminarSerie(mcli, serie);

    interaction.reply({
        content: `> <@${interaction.user.id}> ${
            estado ? "Se" : "**No** se"
        } ha elimiando la serie ${serie} de la base de datos!`,
        ephemeral: true,
    });
};

const seriesAñadirController = async (mcli: MClient, interaction: ChatInputCommandInteraction) => {
    const serie = interaction.options.getString("serie", true);
    const series = [serie];
    const creadas = await anadirSeries(mcli, series);

    interaction.reply({
        content: `> <@${interaction.user.id}> ${
            creadas[0] ? "Se" : "**No** se"
        } ha añadido la serie **${serie}** a la base de datos!`,
        ephemeral: true,
    });
};

module.exports = exp;
