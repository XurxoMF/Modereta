import { Advertencias } from "../models/Advertencias.model";
import { MClient } from "./MClient";
import { DEV, WH_DEV, WH_SANCIONES } from "../config.json";
import { Colores } from "../data/general.data";
import { EmbedBuilder, GuildMember, WebhookClient } from "discord.js";

/**
 * Busca y cuenta todas las Advertencias de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario - Usuario para buscar
 * @return {Promise<{ count: number; rows: Advertencias[] }>}
 */
export const getAdvertenciasCount = async (
    mcli: MClient,
    idUsuario: string
): Promise<{ count: number; rows: Advertencias[] }> => {
    return await mcli.db.Advertencias.findAndCountAll({ where: { idUsuario: idUsuario } });
};

/**
 * Advierte a un usuario y envía una notificación en el canal de sanciones.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario al que advertir
 * @param {string} motivo Motivo de la advertencia
 * @return {Promise<Advertencias>} Advertencia creada
 */
export const anadirAdvertencia = async (
    mcli: MClient,
    idUsuario: string,
    motivo: string,
    moderador: GuildMember
): Promise<Advertencias> => {
    const advertencia = await mcli.db.Advertencias.create({
        idUsuario: idUsuario,
        motivo: motivo,
    });

    const wh = new WebhookClient({ url: DEV ? WH_DEV : WH_SANCIONES });

    const embed = new EmbedBuilder()
        .setTitle("Usuario Advertido")
        .setDescription(`- **Usuario:** <@${idUsuario}>\n- **Motivo:** ${motivo}`)
        .setFooter({
            text: moderador.displayName,
            iconURL: moderador.displayAvatarURL(),
        })
        .setTimestamp(Date.now())
        .setColor(Colores.ADVERTENCIAS);

    await wh.send({ content: `<@${idUsuario}>`, embeds: [embed] });

    return advertencia;
};

/**
 * Elimina una advertencia según su ID
 *
 * @param {MClient} mcli
 * @param {number} id ID de la advertencia
 * @return {Promise<Advertencias | null>} Advertencia eliminada o null si no existe
 */
export const eliminarAdvertencia = async (
    mcli: MClient,
    id: number
): Promise<Advertencias | null> => {
    const advertencia = await mcli.db.Advertencias.findOne({ where: { id: id } });

    if (advertencia !== null) {
        advertencia.destroy();
    }

    return advertencia;
};
