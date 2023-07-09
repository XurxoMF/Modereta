import { MClient } from "../MClient";

/**
 * Recuento de series de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se contarán las series
 * @return {Promise<number>} Cantidad de series que tiene el usuario en su lista
 */
export const countSeriesUsuario = async (mcli: MClient, idUsuario: string): Promise<number> => {
    const count = await mcli.db.SofiSeriesUsuarios.count({
        where: { idUsuario: idUsuario },
    });

    return count;
};
