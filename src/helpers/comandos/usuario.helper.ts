import {
    ChatInputCommandInteraction,
    UserContextMenuCommandInteraction,
    GuildMember,
    EmbedBuilder,
} from "discord.js";
import { MClient } from "../MClient";
import { Colores } from "../../data/general.data";
import { GestoresDeUsuarios } from "../../data/general.data";

export const usuarioInfoController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction
) => {
    const member = interaction.isChatInputCommand()
        ? <GuildMember>interaction.options.getMember("usuario")
        : <GuildMember>interaction.targetMember;

    if (
        !(<GuildMember>interaction.member)["_roles"].some((roleId) =>
            GestoresDeUsuarios.some((rol) => roleId === rol)
        )
    ) {
        return interaction.reply({
            content: `> No tines permisos para usar ese comando!`,
            ephemeral: true,
        });
    }

    if (member === null) {
        return interaction.reply({
            content: `> El usuario mencionado no está en el server!`,
        });
    }

    const union =
        member.joinedTimestamp !== null ? Math.floor(member.joinedTimestamp / 1000) : null;

    const creado =
        member.user.createdTimestamp !== null
            ? Math.floor(member.user.createdTimestamp / 1000)
            : null;

    const nivel = "`N/A`";

    const roles = member.roles.cache
        .filter((rol) => rol.id !== member.guild.id)
        .sort((rolA, rolB) => rolB.position - rolA.position)
        .map((rol) => rol.toString());

    const embed = new EmbedBuilder()
        .setTitle(`${member.user.username} | ID: ${member.id}`)
        .setThumbnail(member.displayAvatarURL())
        .setColor(Colores.EMBED_BASE)
        .setFields([
            {
                name: `UNIÓN`,
                value: union !== null ? `<t:${union}:R>` : "`N/A`",
                inline: true,
            },
            {
                name: `CREACIÓN`,
                value: creado !== null ? `<t:${creado}:R>` : "`N/A`",
                inline: true,
            },
            {
                name: `NIVEL`,
                value: `${nivel}`,
                inline: true,
            },
            {
                name: `ROLES`,
                value: `${roles.join(", ")}`,
            },
        ]);

    interaction.reply({
        embeds: [embed],
    });
};
