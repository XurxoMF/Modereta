import { MClient } from "../MClient";

/**
 * Busca el nivel de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario ID del usuario del que se buscará el nivel.
 * @return {Promise<number>}  Nivel del usuario o -1 si no se encuentra el nievel.
 */
export const getNivel = async (mcli: MClient, idUsuario: string): Promise<number> => {
    const usuario = await mcli.db.Niveles.findOne({
        where: { idUsuario: idUsuario },
    });

    return usuario !== null ? usuario.getDataValue("nivel") : -1;
};
