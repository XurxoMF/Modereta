import { EmbedBuilder } from "discord.js";
import { Reaccion } from "../../types";
import { Colores } from "../../data/colores.data";

/**
 * Genera un embed con una frase de descripción, color de embed por defecto y un gif como imagen dependiendo de la reacción pasada como parámetro.
 *
 * En la frase reemplaza `{{usuario}}` por la mención del usuario con el id pasado como parámetro.
 *
 * @param {Reaccion} reaccion Reacción de la que sacar los valores
 * @param {string} idUsuario Usuario por el que se reemplazará {{usuario}} en la frase
 * @return {EmbedBuilder}  EmbedBuilder preparado para ser enviado
 */
export const generarEmbed = (reaccion: Reaccion, idUsuario: string): EmbedBuilder => {
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
