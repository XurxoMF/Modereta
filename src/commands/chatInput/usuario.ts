import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoChatInput } from "../../types";
import { usuarioInfoController } from "../../helpers/commands/usuario.helper";
import { GestoresDeUsuarios } from "../../data/general.data";
import { anadirAdvertencia, eliminarAdvertencia } from "../../helpers/Advertencias.helper";

const exp: ComandoChatInput = {
    tipo: TipoComandos.ChatInput,
    data: new SlashCommandBuilder()
        .setName("usuario")
        .setDescription("Comandos realicionados con usuarios!")
        .addSubcommand((s) =>
            s
                .setName("info")
                .setDescription("Muestra información sobre el usuario.")
                .addUserOption((o) =>
                    o
                        .setName("usuario")
                        .setDescription("Usuario del que se mostrará la información.")
                        .setRequired(true)
                )
        )
        .addSubcommandGroup((sg) =>
            sg
                .setName("advertencias")
                .setDescription("Gestiona las advertencias de un usuario.")
                .addSubcommand((s) =>
                    s
                        .setName("añadir")
                        .setDescription("Añade una advertencia a un usuario.")
                        .addUserOption((o) =>
                            o
                                .setName("usuario")
                                .setDescription("Usuario al que advertir.")
                                .setRequired(true)
                        )
                        .addStringOption((o) =>
                            o
                                .setName("razón")
                                .setDescription("Razón de la advertencia.")
                                .setRequired(true)
                        )
                )
                .addSubcommand((s) =>
                    s
                        .setName("eliminar")
                        .setDescription("Elimina una advertencia.")
                        .addNumberOption((o) =>
                            o
                                .setName("id")
                                .setDescription(
                                    "ID de la advertencia a eliminar. Usa /usuario info para ver el id."
                                )
                                .setRequired(true)
                        )
                )
        ),
    async execute(mcli: MClient, interaction: ChatInputCommandInteraction) {
        // Si no tiene el rol Admin/Mod/Propietario cancelamos.
        if (
            !(<GuildMember>interaction.member)["_roles"].some((roleId) =>
                GestoresDeUsuarios.some((rol) => roleId === rol)
            )
        ) {
            return interaction.reply({
                content: `> No tines permisos para usar este comando!`,
                ephemeral: true,
            });
        }

        const subcommand = interaction.options.getSubcommand();
        const subcommandGroup = interaction.options.getSubcommandGroup();

        if (subcommandGroup === null) {
            switch (subcommand) {
                case "info":
                    usuarioInfoController(mcli, interaction);
                    break;

                default:
                    break;
            }
        } else {
            switch (subcommandGroup) {
                case "advertencias":
                    switch (subcommand) {
                        case "añadir":
                            usuarioAdvertenciasAnadirController(mcli, interaction);
                            break;
                        case "eliminar":
                            usuarioAdvertenciasEliminarController(mcli, interaction);
                            break;

                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }
        }
    },
};

module.exports = exp;

const usuarioAdvertenciasAnadirController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction
) => {
    const member = <GuildMember | null>interaction.options.getMember("usuario");

    if (member === null) {
        return interaction.reply({
            content: `> <@${interaction.user.id}> El usuario mencionado no está en el servidor!`,
            ephemeral: true,
        });
    }

    const razon = interaction.options.getString("razón", true);

    const advertencia = await anadirAdvertencia(
        mcli,
        member.id,
        razon,
        <GuildMember>interaction.member
    );

    interaction.reply({
        content: `> <@${interaction.user.id}> Se ha advertido al usuario <@${advertencia.idUsuario}> por ${advertencia.razon}!`,
        ephemeral: true,
    });
};

const usuarioAdvertenciasEliminarController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction
) => {
    const id = interaction.options.getNumber("id", true);

    const eliminada = await eliminarAdvertencia(mcli, id);

    if (eliminada !== null) {
        interaction.reply({
            content: `> <@${interaction.user.id}> Se ha eliminado la advertencia con id **${id}** del usuario <@${eliminada.idUsuario}>!`,
            ephemeral: true,
        });
    } else {
        interaction.reply({
            content: `> <@${interaction.user.id}> No se h encontrado ninguna Advertencia con el id **${id}**!`,
            ephemeral: true,
        });
    }
};
