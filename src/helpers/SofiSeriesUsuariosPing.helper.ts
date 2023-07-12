import { SofiSeriesUsuariosPing } from "src/models/SofiSeriesUsuariosPing.model";
import { MClient } from "./MClient";
/**
 * Activa o desactiva los pings de drops de series de la colección de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario al que cambiar es estado del ping
 * @param {boolean} estado Activado o desactivado
 * @returns {Promise<boolean>} Como queda después del cambio
 */
export const togle = async (
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
 *
 * @param {MClient} mcli
 * @returns {}
 */
export const buscarTodos = async (mcli: MClient): Promise<SofiSeriesUsuariosPing[]> => {
    return await mcli.db.SofiSeriesUsuariosPing.findAll({ where: { ping: true } });
};
