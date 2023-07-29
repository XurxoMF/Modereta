import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoChatInput } from "../../types";
import { usuarioInfoController } from "../../helpers/commands/usuario.helper";
import { GestoresDeUsuarios } from "../../data/general.data";
import { anadirAdvertencia, eliminarAdvertencia } from "../../helpers/Advertencias.helper";
import { anadirNota, eliminarNota } from "../../helpers/Notas.helper";
import { desmutear, mutear } from "../../helpers/Muteos.helper";

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
                        .setName("advertir")
                        .setDescription("Añade una advertencia a un usuario.")
                        .addUserOption((o) =>
                            o
                                .setName("usuario")
                                .setDescription("Usuario al que advertir.")
                                .setRequired(true)
                        )
                        .addStringOption((o) =>
                            o
                                .setName("motivo")
                                .setDescription("Motivo de la advertencia.")
                                .setRequired(true)
                        )
                )
                .addSubcommand((s) =>
                    s
                        .setName("desadvertir")
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
        )
        .addSubcommandGroup((sg) =>
            sg
                .setName("notas")
                .setDescription(
                    "Gestiona las notas de un usuario. Solo admins y mods podrán verlas!"
                )
                .addSubcommand((s) =>
                    s
                        .setName("añadir")
                        .setDescription(
                            "Añade una nota a un usuario. Solo admins y mods podrán verlas!"
                        )
                        .addUserOption((o) =>
                            o
                                .setName("usuario")
                                .setDescription("Usuario al que añadir la nota.")
                                .setRequired(true)
                        )
                        .addStringOption((o) =>
                            o
                                .setName("nota")
                                .setDescription("Nota para dejarle al usuario.")
                                .setRequired(true)
                        )
                )
                .addSubcommand((s) =>
                    s
                        .setName("eliminar")
                        .setDescription("Elimina una nota a un usuario.")
                        .addNumberOption((o) =>
                            o
                                .setName("id")
                                .setDescription(
                                    "ID de la nota a eliminar. Usa /usuario info para ver el id."
                                )
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup((sg) =>
            sg
                .setName("muteos")
                .setDescription("Gestiona los muteos de un usuario.")
                .addSubcommand((s) =>
                    s
                        .setName("mutear")
                        .setDescription("Mutea a un usuario.")
                        .addUserOption((o) =>
                            o
                                .setName("usuario")
                                .setDescription("Usuario al que se muteará.")
                                .setRequired(true)
                        )
                        .addNumberOption((o) =>
                            o
                                .setName("duración")
                                .setDescription(
                                    "Cuanto tiempo estrá muteado el usuario. Se puede desmutear con /usuario muteos desmutear."
                                )
                                .setRequired(true)
                                .addChoices(
                                    { name: "Indefinido", value: 0 },
                                    { name: "1 Hora", value: 3600000 },
                                    { name: "3 Horas", value: 10800000 },
                                    { name: "6 Horas", value: 21600000 },
                                    { name: "12 Horas", value: 43200000 },
                                    { name: "1 Día", value: 86400000 },
                                    { name: "2 Días", value: 172800000 },
                                    { name: "3 Días", value: 259200000 },
                                    { name: "4 Días", value: 345600000 },
                                    { name: "5 Días", value: 432000000 },
                                    { name: "6 Días", value: 518400000 },
                                    { name: "1 Semana", value: 604800017 },
                                    { name: "2 Semanas", value: 1209600033 },
                                    { name: "3 Semanas", value: 1814400050 },
                                    { name: "1 Mes", value: 2629800000 }
                                )
                        )
                        .addStringOption((o) =>
                            o
                                .setName("motivo")
                                .setDescription("Motivo del muteo.")
                                .setRequired(true)
                        )
                )
                .addSubcommand((s) =>
                    s
                        .setName("desmutear")
                        .setDescription("Desmutea a un usuario.")
                        .addUserOption((o) =>
                            o
                                .setName("usuario")
                                .setDescription("Usuario al que quieres demutear.")
                                .setRequired(true)
                        )
                        .addStringOption((o) =>
                            o
                                .setName("motivo")
                                .setDescription("Motivo del desmuteo.")
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
                    usuarioInfoController(mcli, interaction, true);
                    break;

                default:
                    break;
            }
        } else {
            switch (subcommandGroup) {
                case "advertencias":
                    switch (subcommand) {
                        case "advertir":
                            usuarioAdvertenciasAadvertirController(mcli, interaction);
                            break;
                        case "desadvertir":
                            usuarioAdvertenciasDesadvertirController(mcli, interaction);
                            break;

                        default:
                            break;
                    }
                    break;

                case "notas":
                    switch (subcommand) {
                        case "añadir":
                            usuarioNotasAnadirController(mcli, interaction);
                            break;
                        case "eliminar":
                            usuarioNotasEliminarController(mcli, interaction);
                            break;

                        default:
                            break;
                    }
                    break;

                case "muteos":
                    switch (subcommand) {
                        case "mutear":
                            usuarioMuteosMutearController(mcli, interaction);
                            break;
                        case "desmutear":
                            usuarioMuteosDesmutearController(mcli, interaction);
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

const usuarioAdvertenciasAadvertirController = async (
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

    const motivo = interaction.options.getString("motivo", true);

    const advertencia = await anadirAdvertencia(
        mcli,
        member.id,
        motivo,
        <GuildMember>interaction.member
    );

    interaction.reply({
        content: `> <@${interaction.user.id}> Se ha advertido al usuario <@${advertencia.idUsuario}> por ${advertencia.motivo}!`,
        ephemeral: true,
    });
};

const usuarioAdvertenciasDesadvertirController = async (
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
            content: `> <@${interaction.user.id}> No se h encontrado ninguna advertencia con el id **${id}**!`,
            ephemeral: true,
        });
    }
};

const usuarioNotasAnadirController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction
) => {
    const usuario = <GuildMember | null>interaction.options.getMember("usuario");
    const idAutor = interaction.user.id;

    if (usuario === null) {
        return interaction.reply({
            content: `> <@${idAutor}> Ese usuario no está en el servidor!`,
            ephemeral: true,
        });
    }

    const idUsuario = usuario.id;
    const nota = interaction.options.getString("nota", true);

    const notaCreada = await anadirNota(mcli, idUsuario, nota, idAutor);

    interaction.reply({
        content: `> <@${idAutor}> Has agregado una nota a <@${idUsuario}> con el siguiente contenido:\n> ${notaCreada.nota}`,
    });
};

const usuarioNotasEliminarController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction
) => {
    const id = interaction.options.getNumber("id", true);

    const eliminada = await eliminarNota(mcli, id);

    if (eliminada !== null) {
        interaction.reply({
            content: `> <@${interaction.user.id}> Se ha eliminado la nota con id **${id}** del usuario <@${eliminada.idUsuario}>!`,
            ephemeral: true,
        });
    } else {
        interaction.reply({
            content: `> <@${interaction.user.id}> No se h encontrado ninguna nota con el id **${id}**!`,
            ephemeral: true,
        });
    }
};

const usuarioMuteosMutearController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction
) => {
    const member = <GuildMember | null>interaction.options.getMember("usuario");
    const autor = <GuildMember>interaction.member;

    if (member === null) {
        return interaction.reply({
            content: `> <@${autor.id}> El usuario mencionado no está en el servidor!`,
            ephemeral: true,
        });
    }

    const motivo = interaction.options.getString("motivo", true);
    const duracion = interaction.options.getNumber("duración", true);

    let hasta = Date.now() + duracion;

    if (duracion === 0) {
        hasta = 0;
    }

    const muteo = await mutear(mcli, motivo, hasta, member, autor);

    if (muteo === null) {
        return interaction.reply({
            content: `> <@${autor.id}> Ese usuario ya está muteado!`,
            ephemeral: true,
        });
    }

    interaction.reply({
        content: `> <@${autor.id}> Se ha muteado a <@${muteo.idUsuario}> ${
            muteo.fin === 0
                ? "`de forma indefinida`"
                : `hasta el <t:${Math.floor(muteo.fin / 1000)}:F>`
        } por el siguiente motivo:\n> ${muteo.motivo}`,
        ephemeral: true,
    });
};

const usuarioMuteosDesmutearController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction
) => {
    const member = <GuildMember | null>interaction.options.getMember("usuario");
    const autor = <GuildMember>interaction.member;

    if (member === null) {
        return interaction.reply({
            content: `> <@${autor.id}> El usuario mencionado no está en el servidor!`,
            ephemeral: true,
        });
    }

    const motivo = interaction.options.getString("motivo", true);

    const desmuteo = await desmutear(mcli, member, motivo, autor);

    if (desmuteo === null) {
        return interaction.reply({
            content: `> <@${autor.id}> Actualmente ese usuario no está muteado!`,
            ephemeral: true,
        });
    }

    interaction.reply({
        content: `> <@${autor.id}> Se ha desmuteado a <@${desmuteo.idUsuario}> por el siguiente motivo:\n> ${motivo}>`,
        ephemeral: true,
    });
};
