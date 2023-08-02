import { SofiSeriesUsuariosPing } from "../models/SofiSeriesUsuariosPing.model";
import { MClient } from "./MClient";
/**
 * Activa o desactiva los pings de drops de series de la colección de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario al que cambiar es estado del ping
 * @param {boolean} estado Activado o desactivado
 * @returns {Promise<boolean>} Como queda después del cambio
 */
export const toggle = async (
    mcli: MClient,
    idUsuario: string,
    estado: boolean
): Promise<boolean> => {
    const [actual, creado] = await mcli.db.SofiSeriesUsuariosPing.findOrCreate({
        where: { idUsuario: idUsuario },
        defaults: { idUsuario: idUsuario, ping: estado },
    });

    if (creado) {
        return actual.getDataValue("ping");
    } else {
        const actualizado = await actual.update({
            ping: estado,
        });
        return actualizado.getDataValue("ping");
    }
};

/**
 * Busca todos los pings de todos los uisuarios.
 *
 * @param {MClient} mcli
 * @returns {Promise<SofiSeriesUsuariosPing[]>} Lista de pings de usuarios
 */
export const buscarTodos = async (mcli: MClient): Promise<SofiSeriesUsuariosPing[]> => {
    return await mcli.db.SofiSeriesUsuariosPing.findAll();
};

/**
 * BUsca el estado de ping de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario a comprobar
 * @return {Promise<boolean>} True si el usuario lo tiene en true o si no lo ha establecido, false si lo ha desactivado
 */
export const checkEstado = async (mcli: MClient, idUsuario: string): Promise<boolean> => {
    const ping = await mcli.db.SofiSeriesUsuariosPing.findOne({ where: { idUsuario: idUsuario } });

    if (ping === null) return true;

    return ping.ping;
};
