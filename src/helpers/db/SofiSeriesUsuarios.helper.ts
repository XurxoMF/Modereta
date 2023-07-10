import { SofiSeriesUsuarios } from "src/models/SofiSeriesUsuarios.model";
import { MClient } from "../MClient";
import { Op, Sequelize } from "sequelize";

/**
 * Recuento de series de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se contarán las series
 * @return {Promise<number>} Cantidad de series que tiene el usuario en su lista
 */
export const count = async (mcli: MClient, idUsuario: string): Promise<number> => {
    const count = await mcli.db.SofiSeriesUsuarios.count({
        where: { idUsuario: idUsuario },
    });

    return count;
};

/**
 * Añade una serie a un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se añadirá la serie
 * @param {string} serie Serie que se añadirá al usuario
 * @return {Promise<[SofiSeriesUsuarios, boolean]>} [ registro de la db, creada o encontrada ]
 */
export const anadir = async (
    mcli: MClient,
    idUsuario: string,
    serie: string
): Promise<[SofiSeriesUsuarios, boolean]> => {
    return await mcli.db.SofiSeriesUsuarios.findOrCreate({
        where: { idUsuario: idUsuario, serie: serie },
        defaults: { idUsuario: idUsuario, serie: serie },
    });
};

/**
 * Elimina una serie a un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se eliminará la serie
 * @param {string} serie Serie que se eliminará al usuario
 * @return {Promise<number>} Cantidad de registros eliminados
 */
export const eliminar = async (
    mcli: MClient,
    idUsuario: string,
    serie: string
): Promise<number> => {
    return await mcli.db.SofiSeriesUsuarios.destroy({
        where: { idUsuario: idUsuario, serie: serie },
    });
};

/**
 * Busca todas las series de un usuario
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se buscarán las series
 * @return {Promise<SofiSeriesUsuarios[]>} Array de series
 */
export const buscarTodoPorId = async (
    mcli: MClient,
    idUsuario: string
): Promise<SofiSeriesUsuarios[]> => {
    return await mcli.db.SofiSeriesUsuarios.findAll({
        where: { idUsuario: idUsuario },
    });
};

/**
 * Busca los usuario que coleccionan las series dropeadas.
 *
 * @param mcli
 * @param {string} series Array de series del drop para buscarlas
 * @returns {Promise<SofiSeriesUsuarios[]>} Usuarios que soleccionan las series
 */
export const buscarTodoPorSerie = async (
    mcli: MClient,
    series: string[]
): Promise<SofiSeriesUsuarios[]> => {
    return await mcli.db.SofiSeriesUsuarios.findAll({
        where: {
            serie: {
                [Op.or]: [
                    {
                        [Op.like]: series[0]?.toLowerCase(),
                    },
                    {
                        [Op.like]: series[1]?.toLowerCase(),
                    },
                    {
                        [Op.like]: series[2]?.toLowerCase(),
                    },
                ],
            },
        },
    });
};
