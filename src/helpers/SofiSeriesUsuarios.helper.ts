import { SofiSeriesUsuarios } from "../models/SofiSeriesUsuarios.model";
import { MClient } from "./MClient";
import { Op } from "sequelize";

/**
 * Estados de respuesta de agregarSerie()
 *
 * @enum {number}
 */
export enum AgregarSerieStatus {
    /**Serie añadida correctamente */
    EXITO,
    /**Ya tiene 150 series */
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
    const series = await count(mcli, idUsuario);

    if (series >= 150) return AgregarSerieStatus.MAXIMO_SERIES;

    const [registro, creada] = await mcli.db.SofiSeriesUsuarios.findOrCreate({
        where: { idUsuario: idUsuario, serie: serie.trim() },
        defaults: { idUsuario: idUsuario, serie: serie.trim() },
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
 * @returns {Promise<SofiSeriesUsuarios[]>} Usuarios que coleccionan las series
 */
export const buscarUsuariosPorSeries = async (
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

/**
 * Comprueba si un usuario colecciona una serie en concreto.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario al que se buscará la serie
 * @param {string} serie Serie que se buscará
 * @return {Promise<boolean>} Colecciona o no la serie
 */
export const usuarioColecciona = async (
    mcli: MClient,
    idUsuario: string,
    serie: string
): Promise<boolean> => {
    const registro = await mcli.db.SofiSeriesUsuarios.findOne({
        where: {
            idUsuario: idUsuario,
            serie: {
                [Op.or]: [
                    {
                        [Op.like]: serie.toLowerCase(),
                    },
                ],
            },
        },
    });

    return registro === null ? false : true;
};

/**
 * Busca los usuario que coleccionan una serie en específico.
 *
 * @param mcli
 * @param {string} serie Serie por la que se buscará
 * @returns {Set<string>} IDs de los usuarios que coleccionan las series
 */
export const buscarUsuariosPorSerie = async (
    mcli: MClient,
    serie: string
): Promise<Set<string>> => {
    const usuarios = await mcli.db.SofiSeriesUsuarios.findAll({
        where: {
            serie: {
                [Op.or]: [
                    {
                        [Op.like]: serie.toLowerCase(),
                    },
                ],
            },
        },
    });

    let IDs = new Set<string>();
    for (const usuario of usuarios) {
        IDs.add(usuario.idUsuario);
    }

    return IDs;
};

/**
 * Busca las 10 primeras series de un usuario que contengan las palabras seleccionadas.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se buscarán las series
 * @param {string} palabras Palabras que tienen que contener las series
 * @returns {Promise<string[]>} Series encontradas para ese suuario
 */
export const buscarLikeSeriesUsuarios = async (
    mcli: MClient,
    idUsuario: string,
    palabras: string
): Promise<string[]> => {
    const series = await mcli.db.SofiSeriesUsuarios.findAll({
        where: { idUsuario: idUsuario, serie: { [Op.like]: `%${palabras}%` } },
        limit: 10,
    });

    const arraySeries: string[] = [];

    for (const serie of series) {
        arraySeries.push(serie.getDataValue("serie"));
    }

    return arraySeries;
};

/**
 * Busca los usuarios que coleccionan una serie en específico usanso el inicio de la serie.
 *
 * @param mcli
 * @param {string} inicioSerie Primeras palabras de la serie o la serie completa
 * @returns {string[]} IDs de los usuarios que coleccionan las series
 */
export const buscarUsuariosPorInicioSerie = async (
    mcli: MClient,
    inicioSerie: string
): Promise<string[]> => {
    if (inicioSerie.endsWith("...")) {
        inicioSerie = inicioSerie.slice(0, -3);
    }

    const usuarios = await mcli.db.SofiSeriesUsuarios.findAll({
        where: {
            serie: {
                [Op.like]: `${inicioSerie}%`,
            },
        },
    });

    let IDs: string[] = [];

    for (const usuario of usuarios) {
        IDs.push(usuario.idUsuario);
    }

    return IDs;
};
