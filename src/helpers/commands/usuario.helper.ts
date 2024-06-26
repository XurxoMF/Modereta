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
import { Advertencias } from "../../models/Advertencias.model";
import { getNotas } from "../Notas.helper";
import { Notas } from "../../models/Notas.model";
import { Muteos } from "../../models/Muteos.model";
import { getMuteosCount } from "../Muteos.helper";

export const usuarioInfoController = async (
    mcli: MClient,
    interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction,
    admin?: boolean
) => {
    const member = interaction.isChatInputCommand()
        ? <GuildMember>interaction.options.getMember("usuario")
        : <GuildMember>interaction.targetMember;

    if (member === null) {
        return interaction.reply({
            content: `> El usuario mencionado no está en el servidor!`,
            ephemeral: true,
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

    if (admin) {
        const notas = await getNotas(mcli, member.id);

        if (notas.count > 0) {
            const lista = await listarNotas(notas.rows);

            embed.addFields({
                name: `NOTAS - ${notas.count}`,
                value: lista,
            });
        }
    }

    const advertencias = await getAdvertenciasCount(mcli, member.id);

    if (advertencias.count > 0) {
        const lista = await listarAdvertencias(advertencias.rows);

        embed.addFields({
            name: `ADVERTENCIAS - ${advertencias.count}`,
            value: lista,
        });
    }

    const muteos = await getMuteosCount(mcli, member.id);

    if (muteos.count > 0) {
        const resMuteos = await listarMuteos(muteos.rows);

        embed.addFields({
            name: `MUTEOS - ${muteos.count}`,
            value: resMuteos.lista,
        });

        if (resMuteos.muteado) {
            embed.setColor(Colores.MUTEOS);
        }
    }

    if (admin) {
        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    } else {
        interaction.reply({
            embeds: [embed],
        });
    }
};

const listarAdvertencias = async (advertencias: Advertencias[]) => {
    let res = ``;

    for (const advertencia of advertencias) {
        res += `🟡 \`ID: ${advertencia.id}\` | <t:${Math.floor(
            (<Date>advertencia.createdAt).getTime() / 1000
        )}:d> | ${advertencia.motivo}\n`;
    }
    return res.slice(0, -1);
};

const listarNotas = async (notas: Notas[]) => {
    let res = ``;

    for (const nota of notas) {
        res += `- \`ID: ${nota.id}\` | <@${nota.idAutor}> | ${nota.nota}\n`;
    }
    return res.slice(0, -1);
};

const listarMuteos = async (muteos: Muteos[]): Promise<{ lista: string; muteado: boolean }> => {
    let res = { lista: ``, muteado: false };

    for (const muteo of muteos) {
        if (muteo.muteado) res.muteado = true;

        res.lista += `${muteo.muteado ? `🔴` : `🟢`} <t:${Math.floor(
            (<Date>muteo.createdAt).getTime() / 1000
        )}:d> - ${
            muteo.fin === 0 ? `Indefinidamente` : `<t:${Math.floor(muteo.fin / 1000)}:d>`
        } | ${muteo.motivo}\n`;
    }
    res.lista = res.lista.slice(0, -1);

    return res;
};
