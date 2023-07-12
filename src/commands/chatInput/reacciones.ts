import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoChatInput, Reaccion } from "../../types";
import Reacciones from "../../data/comandos/reacciones.data";
import { Colores } from "../../data/general.data";

const data = new SlashCommandBuilder()
    .setName("reacciones")
    .setDescription("Envía una gif anime para reaccionar a lo que quieras.");

for (const index in Reacciones) {
    const reaccion = Reacciones[index];
    data.addSubcommand((s) => s.setName(reaccion.nombre).setDescription(reaccion.desc));
}

const exp: ComandoChatInput = {
    tipo: TipoComandos.ChatInput,
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

/**
 * Genera un embed con una frase de descripción, color de embed por defecto y un gif como imagen dependiendo de la reacción pasada como parámetro.
 *
 * En la frase reemplaza `{{usuario}}` por la mención del usuario con el id pasado como parámetro.
 *
 * @param {Reaccion} reaccion Reacción de la que sacar los valores
 * @param {string} idUsuario Usuario por el que se reemplazará {{usuario}} en la frase
 * @return {EmbedBuilder}  EmbedBuilder preparado para ser enviado
 */
const generarEmbed = (reaccion: Reaccion, idUsuario: string): EmbedBuilder => {
    return new EmbedBuilder()
        .setColor(Colores.EMBED_BASE)
        .setImage(randomGif(reaccion.gifs))
        .setDescription(reaccion.frase.replace("{{usuario}}", `<@${idUsuario}>`));
};

/**
 * Devuelve un gif aleatorio de un array[] de URLs de gifs.
 *
 * @param {string[]} gifs Array de URLs de gifs
 * @return {string}  URL del gif
 */
const randomGif = (gifs: string[]): string => {
    return gifs[Math.floor(Math.random() * (gifs.length - 1))];
};

module.exports = exp;
