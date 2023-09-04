import { MClient } from "./MClient";
import { Op } from "sequelize";

/**
 * Añade series a la base de datos de series de Sofi.
 *
 * @param {MClient} mcli
 * @param {string[]} series Array de series para añadir a la db
 * @return {Promise<void>} Nada, es silenciosa
 */
export const anadirSeries = async (mcli: MClient, series: string[]): Promise<void> => {
    try {
        for (const serie of series) {
            await mcli.db.SofiSeries.findOrCreate({ where: { serie: serie.trim() } });
        }
    } catch (err) {
        console.log(
            `🔴 Error al añadir una de las sigueintes series: "${series.join('", "')}"\n${err}`
        );
    }
};

/**
 * Elimina una serie de la base de datos de series de Sofi.
 *
 * @param {MClient} mcli
 * @param {string} serie Seriee para eliminar a la db
 * @return {boolean} True si se ha elimiando, false si no.
 */
export const eliminarSerie = async (mcli: MClient, serie: string): Promise<boolean> => {
    try {
        const serieEncontrada = await mcli.db.SofiSeries.findOne({ where: { serie: serie } });
        if (serieEncontrada) {
            await serieEncontrada.destroy();
            return true;
        }
        return false;
    } catch (err) {
        console.log(`🔴 Error al eliminar la serie de la db de series de Sofi: "${serie}"\n${err}`);
        return false;
    }
};

/**
 * Busca las 10 primeras series de Sofi que contengan ciertas palabras en el nombre!
 *
 * @param {MClient} mcli
 * @param {string} palabras Palabras a buscar
 * @return {Promise<string[]>} Array de series encontradas
 */
export const buscarLikeTodasLasSeries = async (
    mcli: MClient,
    palabras: string
): Promise<string[]> => {
    const series = await mcli.db.SofiSeries.findAll({
        where: { serie: { [Op.like]: `%${palabras}%` } },
        limit: 10,
    });

    const arraySeries = [];

    for (const serie of series) {
        arraySeries.push(serie.serie);
    }

    return arraySeries;
};
