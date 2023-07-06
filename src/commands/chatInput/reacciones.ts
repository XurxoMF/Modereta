import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoChatInput } from "../../types";
import Reacciones from "../../data/comandos/reacciones.data";
import { generarEmbed } from "../../helpers/comandos/Reacciones";

const data = new SlashCommandBuilder()
    .setName("reacciones")
    .setDescription("Envía una gif anime para reaccionar a lo que quieras.");

for (const index in Reacciones) {
    const reaccion = Reacciones[index];
    data.addSubcommand((sub) => sub.setName(reaccion.nombre).setDescription(reaccion.desc));
}

const exp: ComandoChatInput = {
    tipo: TipoComandos.ChatInput,
    cooldown: 10,
    data: data,
    async execute(mcli: MClient, interaction: ChatInputCommandInteraction) {
        const idUsuario = interaction.user.id;
        const index = Reacciones.findIndex(
            (reaccion) => reaccion.nombre === interaction.options.getSubcommand()
        );

        const embed = generarEmbed(Reacciones[index], idUsuario);

        interaction.reply({
            embeds: [embed],
        });
    },
};

module.exports = exp;
