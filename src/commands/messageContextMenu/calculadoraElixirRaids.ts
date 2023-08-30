import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    MessageContextMenuCommandInteraction,
    EmbedBuilder,
    EmbedField,
} from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoMessageContextMenu } from "../../types";
import { Colores } from "../../data/general.data";
const SOFI_ID = "853629533855809596";

const exp: ComandoMessageContextMenu = {
    tipo: TipoComandos.MessageContextMenu,
    data: new ContextMenuCommandBuilder()
        .setName("Calcular Elixir")
        .setType(ApplicationCommandType.Message),
    async execute(mcli: MClient, interaction: MessageContextMenuCommandInteraction) {
        const msg = interaction.targetMessage;

        if (msg.embeds[0].title?.includes("Guild Members") && msg.member?.id === SOFI_ID) {
            const fields: EmbedField[] = [];
            const frases = <string[]>msg.embeds[0].description?.split("\n");

            for (const frase of frases) {
                const datos = frase.split("•");
                if (datos[5] && datos[5].trim().startsWith("<@")) {
                    let id_usuario = datos[5].trim().slice(2, -1);
                    let f_usuario = `\`Usuario:\` ➜ <@${id_usuario}>`;

                    let facil = datos[2].trim().slice(1, -1).trim().split("/");
                    let medio = datos[3].trim().slice(1, -1).trim().split("/");
                    let dificil = datos[4].trim().slice(1, -1).trim().split("/");

                    let v_facil = Number(facil[0]);
                    let a_facil = Number(facil[1]);
                    let e_facil = v_facil * 60;
                    let f_facil = `\`Fácil:  \` ➜ **${v_facil} :trophy: · ${a_facil} :crossed_swords: = ${e_facil} <:elixir_s:1106574363433644052>**`;

                    let v_medio = Number(medio[0]);
                    let a_medio = Number(medio[1]);
                    let e_medio = v_medio * 90;
                    let f_medio = `\`Medio:  \` ➜ **${v_medio} :trophy: · ${a_medio} :crossed_swords: = ${e_medio} <:elixir_s:1106574363433644052>**`;

                    let v_dificil = Number(dificil[0]);
                    let a_dificil = Number(dificil[1]);
                    let e_dificil = v_dificil * 150;
                    let f_dificil = `\`Difícil:\` ➜ **${v_dificil} :trophy: · ${a_dificil} :crossed_swords: = ${e_dificil}  <:elixir_s:1106574363433644052>**`;

                    let t_ataques = a_facil + a_medio + a_dificil;
                    let e_ataques = t_ataques * 20;
                    let f_ataques = `\`Ataques:\` ➜ **${t_ataques} = ${e_ataques} <:elixir_s:1106574363433644052>**`;

                    let e_total = e_ataques + e_facil + e_medio + e_dificil;
                    let f_total = `\`Total:  \` ➜ **${e_total} <:elixir_s:1106574363433644052>**`;

                    if (e_total > 0) {
                        fields.push({
                            name: `ID: ${id_usuario}`,
                            value: `${f_usuario}\n${f_ataques}\n${f_facil}\n${f_medio}\n${f_dificil}\n${f_total}`,
                            inline: false,
                        });
                    }
                }
            }

            const embed = new EmbedBuilder()
                .setTitle("ESTADÍSTICAS DE CADA USUARIO")
                .setColor(Colores.EMBED_BASE);

            if (fields.length > 0) {
                embed.setFields(fields);
            } else {
                embed.setDescription(
                    "**Ningún usuario ha atacado ni conseguido elixir en esta página!**"
                );
            }

            interaction.reply({
                embeds: [embed],
            });
        } else {
            interaction.reply({
                content: `> <@${interaction.user.id}> Ese mensaje no contiene información sobre los ataques de los usuarios! Usa el comando \`sgi\` y selecciona \`Guild Members\` en el desplegable para ver la lista de ataques de los uausrios de tu guild!`,
                ephemeral: true,
            });
        }
    },
};

module.exports = exp;
