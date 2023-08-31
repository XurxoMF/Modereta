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
            await mcli.db.SofiSeries.findOrCreate({ where: { serie: serie } });
        }
    } catch (err) {
        console.log(
            `🔴 Error al añadir una de las sigueintes series: "${series.join('", "')}"\n${err}`
        );
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
