import { Notas } from "../models/Notas.model";
import { MClient } from "./MClient";

/**
 * Añade una nota a un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario al que añadir la nota
 * @param {string} nota Nota para añadir
 * @param {string} idAutor Autor de la nota
 * @return {Promise<Notas>} Nota creada
 */
export const anadirNota = async (
    mcli: MClient,
    idUsuario: string,
    nota: string,
    idAutor: string
): Promise<Notas> => {
    return await mcli.db.Notas.create({
        idUsuario: idUsuario,
        nota: nota,
        idAutor: idAutor,
    });
};

/**
 * Cuenta y devuelve todas las Notas de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se buscarán las notas
 * @return {{Promise<{ count: number; rows: Notas[] }>}} Recuento y notas del usuario
 */
export const getNotas = async (
    mcli: MClient,
    idUsuario: string
): Promise<{ count: number; rows: Notas[] }> => {
    return await mcli.db.Notas.findAndCountAll({ where: { idUsuario: idUsuario } });
};

/**
 * Elimina una nota según su ID
 *
 * @param {MClient} mcli
 * @param {number} id ID de la nota
 * @return {Promise<Notas | null>} Nota eliminada o null si no existe
 */
export const eliminarNota = async (mcli: MClient, id: number): Promise<Notas | null> => {
    const nota = await mcli.db.Notas.findOne({ where: { id: id } });

    if (nota !== null) {
        nota.destroy();
    }

    return nota;
};
