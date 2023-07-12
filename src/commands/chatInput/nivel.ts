import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoChatInput } from "../../types";
import { getRegistro, xpNecesaria } from "../../helpers/Niveles.helper";
import { Colores, RecompensasNivel } from "../../data/general.data";

const exp: ComandoChatInput = {
    tipo: TipoComandos.ChatInput,
    data: new SlashCommandBuilder()
        .setName("nivel")
        .setDescription("Muestra tu nivel, xp y roles obtenidos hasta el momento.")
        .addUserOption((o) =>
            o.setName("usuario").setDescription("Usuario del que quieres ver el nivel.")
        ),
    async execute(mcli: MClient, interaction: ChatInputCommandInteraction) {
        const usuario =
            interaction.options.getMember("usuario") !== null
                ? interaction.options.getUser("usuario", true)
                : interaction.user;

        const nivel = await getRegistro(mcli, usuario.id);

        const embed = new EmbedBuilder()
            .setTitle(`Nivel de **${usuario.username}**`)
            .setColor(Colores.EMBED_BASE);

        if (nivel === null) {
            embed.addFields(
                {
                    name: `Nivel`,
                    value: `0`,
                    inline: true,
                },
                {
                    name: `XP`,
                    value: `0 / ${xpNecesaria(0)}`,
                    inline: true,
                },
                {
                    name: `Roles`,
                    value: "`N/A`",
                }
            );
        } else {
            let roles = ``;
            for (const key in RecompensasNivel) {
                let lvl = Number(key);
                if (lvl <= nivel.getDataValue("nivel")) {
                    for (const rol of RecompensasNivel[key]) {
                        roles += `\n<@&${rol}>`;
                    }
                }
            }

            embed.addFields(
                {
                    name: `Nivel`,
                    value: `${nivel.getDataValue("nivel")}`,
                    inline: true,
                },
                {
                    name: `XP`,
                    value: `${nivel.getDataValue("xp")} / ${xpNecesaria(0)}`,
                    inline: true,
                },
                {
                    name: `Roles`,
                    value: roles,
                }
            );
        }

        interaction.reply({
            embeds: [embed],
        });
    },
};

module.exports = exp;
