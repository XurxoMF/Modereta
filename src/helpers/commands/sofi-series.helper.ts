import { MClient } from "../MClient";
import { getNivel } from "../../helpers/db/Niveles.helper";
import { countSeriesUsuario } from "../../helpers/db/SofiSeriesUsuarios.helper";

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
 * Añade una serie a la lista de series de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario al que se añadirá la serie
 * @param {string} serie Serie que se añadirá
 * @return {Promise<AgregarSerieStatus>} Estado de la agregación
 */
export const anadirSerie = async (
    mcli: MClient,
    idUsuario: string,
    serie: string
): Promise<AgregarSerieStatus> => {
    const nivel = await getNivel(mcli, idUsuario);
    const series = await countSeriesUsuario(mcli, idUsuario);

    if (series >= 150) return AgregarSerieStatus.MAXIMO_SERIES;
    if (series >= nivel) return AgregarSerieStatus.NIVEL_INSUFICIENTE;

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
 * Busca todas las series coleccionadas por un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se buscarán la series
 * @returns {Promise<string[]>} Array con el nombre de las series
 */
export const listaSeries = async (mcli: MClient, idUsuario: string): Promise<string[]> => {
    const series = await mcli.db.SofiSeriesUsuarios.findAll({
        where: { idUsuario: idUsuario },
    });

    const arraySeries: string[] = [];

    for (const serie of series) {
        arraySeries.push(serie.getDataValue("serie"));
    }

    return arraySeries;
};
