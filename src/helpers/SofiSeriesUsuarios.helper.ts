import { SofiSeriesUsuarios } from "src/models/SofiSeriesUsuarios.model";
import { MClient } from "./MClient";
import { Op, Sequelize } from "sequelize";
import { getNivel } from "./Niveles.helper";

/**
 * Estados de respuesta de agregarSerie()
 *
 * @enum {number}
 */
export enum AgregarSerieStatus {
    /**Serie añadida correctamente */
    EXITO,
    /**Nivel insuficiente */
    NIVEL_INSUFICIENTE,
    /**Ya tiene 100 series */
    MAXIMO_SERIES,
    /**Serie ya en la lista */
    SERIE_EXISTENTE,
}

/**
 * Estados de respuesta de eliminarSerie()
 *
 * @enum {number}
 */
export enum EliminarSerieStatus {
    /**Serie eliminada correctamente */
    EXITO,
    /**Serie no existente en la lista */
    SERIE_INEXISTENTE,
}

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
 * @return {Promise<AgregarSerieStatus>} Estado de la adición
 */
export const anadirSerie = async (
    mcli: MClient,
    idUsuario: string,
    serie: string
): Promise<AgregarSerieStatus> => {
    const nivel = await getNivel(mcli, idUsuario);
    const series = await count(mcli, idUsuario);

    if (series >= 150) return AgregarSerieStatus.MAXIMO_SERIES;
    if (nivel < 50 && series >= nivel) return AgregarSerieStatus.NIVEL_INSUFICIENTE;

    const [registro, creada] = await mcli.db.SofiSeriesUsuarios.findOrCreate({
        where: { idUsuario: idUsuario, serie: serie },
        defaults: { idUsuario: idUsuario, serie: serie },
    });

    if (creada) {
        return AgregarSerieStatus.EXITO;
    } else {
        return AgregarSerieStatus.SERIE_EXISTENTE;
    }
};

/**
 * Elimina una serie a la lista de series de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario al que se eliminará la serie
 * @param {string} serie Serie que se eliminará
 * @return {Promise<AgregarSerieStatus>} Estado de la eliminación
 */
export const eliminarSerie = async (
    mcli: MClient,
    idUsuario: string,
    serie: string
): Promise<EliminarSerieStatus> => {
    const eliminada = await mcli.db.SofiSeriesUsuarios.destroy({
        where: { idUsuario: idUsuario, serie: serie },
    });

    if (eliminada >= 1) {
        return EliminarSerieStatus.EXITO;
    } else {
        return EliminarSerieStatus.SERIE_INEXISTENTE;
    }
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

/**
 * Busca todas las series coleccionadas por un usuario u las devuelve como array de strings.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se buscarán la series
 * @returns {Promise<string[]>} Array con el nombre de las series
 */
export const listaSeries = async (mcli: MClient, idUsuario: string): Promise<string[]> => {
    const series = await buscarTodoPorId(mcli, idUsuario);

    const arraySeries: string[] = [];

    for (const serie of series) {
        arraySeries.push(serie.getDataValue("serie"));
    }

    return arraySeries;
};
