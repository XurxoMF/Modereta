import {
    ChatInputCommandInteraction,
    UserContextMenuCommandInteraction,
    GuildMember,
    EmbedBuilder,
} from "discord.js";
import { MClient } from "../MClient";
import { Colores } from "../../data/general.data";
import { getNivel } from "../Niveles.helper";
import { getAdvertenciasCount } from "../Advertencias.helper";
import { Advertencias } from "src/models/Advertencias.model";

export const usuarioInfoController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction
) => {
    const member = interaction.isChatInputCommand()
        ? <GuildMember>interaction.options.getMember("usuario")
        : <GuildMember>interaction.targetMember;

    if (member === null) {
        return interaction.reply({
            content: `> El usuario mencionado no está en el servidor!`,
        });
    }

    const union =
        member.joinedTimestamp !== null ? Math.floor(member.joinedTimestamp / 1000) : null;

    const creado =
        member.user.createdTimestamp !== null
            ? Math.floor(member.user.createdTimestamp / 1000)
            : null;

    const nivel =
        (await getNivel(mcli, member.id)) === -1 ? "`N/A`" : await getNivel(mcli, member.id);

    const roles = member.roles.cache
        .filter((rol) => rol.id !== member.guild.id)
        .sort((rolA, rolB) => rolB.position - rolA.position)
        .map((rol) => rol.toString());

    const embed = new EmbedBuilder()
        .setTitle(`${member.displayName} | ${member.id}`)
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

    const advertencias = await getAdvertenciasCount(mcli, member.id);

    if (advertencias.count > 0) {
        const lista = await listarAdvertencias(advertencias);

        embed.addFields({
            name: `ADVERTENCIAS - ${advertencias.count}`,
            value: lista,
        });
    }

    interaction.reply({
        embeds: [embed],
    });
};

const listarAdvertencias = async (advertencias: { count: number; rows: Advertencias[] }) => {
    let res = ``;

    for (const advertencia of advertencias.rows) {
        res += `🟡 \`ID: ${advertencia.id}\` | <t:${Math.floor(
            (<Date>advertencia.createdAt).getTime() / 1000
        )}:d> | ${advertencia.razon}\n`;
    }

    return res.slice(0, -1);
};
