import { Niveles } from "../models/Niveles.model";
import { MClient } from "./MClient";
import { RecompensasNivel } from "../data/general.data";
import { GuildMember } from "discord.js";

/**
 * Busca el nivel de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se buscará el nivel
 * @return {Promise<number>}  Nivel del usuario o -1 si no se encuentra el nievel
 */
export const getNivel = async (mcli: MClient, idUsuario: string): Promise<number> => {
    const usuario = await mcli.db.Niveles.findOne({
        where: { idUsuario: idUsuario },
    });

    return usuario !== null ? usuario.getDataValue("nivel") : -1;
};

/**
 * Busca todos los datos del nivel de un usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se buscará la información
 * @return {Promise<Niveles | null>} Registro de la base de datos con los datos o null si no se encuentra el usuario
 */
export const getUnoPorId = async (mcli: MClient, idUsuario: string): Promise<Niveles | null> => {
    const registro = await mcli.db.Niveles.findOne({
        where: { idUsuario: idUsuario },
    });

    return registro;
};

/**
 * Incrementa la xp de un usuario en un valor aleatorio entre 10 y 20. Si la xp es mayor o igual al máximo de xp del nivel pone xp a 0 e incrementa en 1 el nivel.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario al que se le incrementará la xp
 * @return {Promise<number>} Nuevo nivel del usuario | -1 si no subió de nivel, solo xp
 */
export const incrementarXp = async (mcli: MClient, idUsuario: string): Promise<number> => {
    const rxp = randomXp();

    const [usuario, nuevo] = await mcli.db.Niveles.findOrCreate({
        where: { idUsuario: idUsuario },
        defaults: { idUsuario: idUsuario, xp: 0, nivel: 0 },
    });

    const nxp = usuario.getDataValue("xp") + rxp;
    const nivel = usuario.getDataValue("nivel");

    if (nxp >= xpNecesaria(nivel)) {
        await usuario.update({
            xp: 0,
            nivel: nivel + 1,
        });

        return nivel + 1;
    } else {
        await usuario.update({
            xp: nxp,
        });

        return -1;
    }
};

/**
 * Comprueba si hay roles de recompensas para el nivel y se los asigna a un miembro.
 *
 * @param {GuildMember} miembro Usuario al que se asignarán los roles
 * @param {number} nivel Nivel al que ha subido el usuario
 * @return {Promise<boolean>} true => se añadieron roles || false => no se añadieron roles
 */
export const recompensar = async (miembro: GuildMember, nivel: number): Promise<boolean> => {
    const recompensa: string[] = [];

    for (const [tier, roles] of RecompensasNivel) {
        if (tier <= nivel) recompensa.push(...roles);
    }

    if (recompensa === undefined) return false;

    miembro.roles.add(recompensa);
    return true;
};

/**
 * Devulve un valor aleatorio de XP entre 10 y 20.
 *
 * @return {number} XP
 */
export const randomXp = (): number => {
    let min = 7,
        max = 12;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Calcula la XP necesaria para subir al siguiente nivel.
 *
 * @param {number} nivel Nivel actual del usuario
 * @return {number} XP necesaria
 */
export const xpNecesaria = (nivel: number): number => {
    return nivel === 0 ? 1 : 90 * nivel;
};
