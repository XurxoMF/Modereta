import { MClient } from "./MClient";
import { Op } from "sequelize";

/**
 * Añade un drop a un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario al que añadir el drop
 * @return {Promise<boolean>} True si se añadió correctamente o false si no se guardó correctamente
 */
export const anadirDrop = async (mcli: MClient, idUsuario: string): Promise<boolean> => {
    await mcli.db.SofiDropCount.create({ idUsuario: idUsuario, caducidad: Date.now() + 86400000 });
    return true;
};

/**
 * Busca todos los drops NO caducados de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se contarán los drop
 * @return {Promise<number>} Cantidad de drops no caducados de usuario, hace menos de 1 día
 */
export const countDrops = async (mcli: MClient, idUsuario: string): Promise<number> => {
    return await mcli.db.SofiDropCount.count({ where: { idUsuario: idUsuario } });
};

/**
 * Elimina los drops caducados.
 *
 * @param {MClient} mcli
 * @return {Promise<number>} Cantidad de drops eliminados
 */
export const eliminarCaducados = async (mcli: MClient): Promise<number> => {
    return await mcli.db.SofiDropCount.destroy({ where: { caducidad: { [Op.lte]: Date.now() } } });
};
