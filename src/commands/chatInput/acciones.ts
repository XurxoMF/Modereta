import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoChatInput, Accion } from "../../types";
import Acciones from "../../data/comandos/acciones.data";
import { Colores } from "../../data/general.data";

const data = new SlashCommandBuilder()
    .setName("acciones")
    .setDescription("Envía una gif anime haciendo algo a algún usuario.");

for (const index in Acciones) {
    const reaccion = Acciones[index];
    data.addSubcommand((s) =>
        s
            .setName(reaccion.nombre)
            .setDescription(reaccion.desc)
            .addUserOption((o) =>
                o
                    .setName("usuario")
                    .setDescription("Usuario al que realizar la acción.")
                    .setRequired(true)
            )
    );
}

const exp: ComandoChatInput = {
    tipo: TipoComandos.ChatInput,
    cooldown: 5,
    data: data,
    async execute(mcli: MClient, interaction: ChatInputCommandInteraction) {
        const idDe = interaction.user.id;
        const idPara = interaction.options.getUser("usuario", true).id;

        const index = Acciones.findIndex(
            (reaccion) => reaccion.nombre === interaction.options.getSubcommand()
        );

        const embed = generarEmbed(Acciones[index], idDe, idPara);

        interaction.reply({
            embeds: [embed],
        });
    },
};

/**
 * Genera un embed con una frase de descripción, color de embed por defecto y un gif como imagen dependiendo de la reacción pasada como parámetro.
 *
 * En la frase reemplaza `{{de}}` por la mención del usuario que envía la acción y {{para}} por el usuario que recibe la acción.
 *
 * @param {Accion} accion Reacción de la que sacar los valores
 * @param {string} idDe Usuario por el que se reemplazará {{de}} en la frase
 * @param {string} idPara Usuario por el que remplazará {{para}} en la frase
 * @return {EmbedBuilder}  EmbedBuilder preparado para ser enviado
 */
const generarEmbed = (accion: Accion, idDe: string, idPara: string): EmbedBuilder => {
    return new EmbedBuilder()
        .setColor(Colores.EMBED_BASE)
        .setImage(randomGif(accion.gifs))
        .setDescription(
            accion.frase.replace("{{de}}", `<@${idDe}>`).replace("{{para}}", `<@${idPara}>`)
        );
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
