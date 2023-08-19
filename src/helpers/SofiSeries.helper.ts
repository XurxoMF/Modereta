import { MClient } from "./MClient";

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
            mcli.db.SofiSeries.findOrCreate({ where: { serie: serie } });
        }
    } catch (err) {
        console.log(
            `🔴 Error al añadir una de las sigueintes series: "${series.join('", "')}"\n${err}`
        );
    }
};
