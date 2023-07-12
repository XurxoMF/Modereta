import { Niveles } from "src/models/Niveles.model";
import { MClient } from "./MClient";
import { RecompensasNivel } from "../data/general.data";
import { GuildMember, Message } from "discord.js";

/**
 * Estados de respuesta de subirNivel()
 *
 * @enum {number}
 */
export enum SubirNivelStatus {
    /**Subió de nivel correctamente. */
    EXITO,
    /**Ocurrió algún error, a saber donde, desde subirNivel() para dentro el código basura */
    ERROR,
    /**El usuario subió de nivel */
    NIVEL,
}

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
export const getRegistro = async (mcli: MClient, idUsuario: string): Promise<Niveles | null> => {
    const registro = await mcli.db.Niveles.findOne({
        where: { idUsuario: idUsuario },
    });

    return registro;
};

/**
 * No voy ni a comentar este código, es terrible. En serio, como funciona esta basura?
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario al que subirle el nivel
 * @param {Message} message Mensaje delq ue sacar al member y demás info
 * @return {Promise<{ estado: SubirNivelStatus; roles: any }>} Mi madre, tremenda aberración
 */
export const subirNivel = async (
    mcli: MClient,
    idUsuario: string,
    message: Message
): Promise<{ estado: SubirNivelStatus; roles: any; nivel: number | undefined }> => {
    let xpPlus = randomXp();

    try {
        const [user, novo] = await mcli.db.Niveles.findOrCreate({
            where: { idUsuario: idUsuario },
            defaults: { idUsuario: idUsuario, xp: 0, nivel: 0 },
        });

        let nuevaXp = (user.xp += xpPlus);

        if (nuevaXp >= xpNecesaria(user.nivel)) {
            const nuevoUser = await user.update({
                xp: 0,
                nivel: user.nivel + 1,
            });

            try {
                const roles = await asignarRoles(
                    <GuildMember>message.member,
                    nuevoUser.nivel,
                    false
                );

                return {
                    estado: SubirNivelStatus.NIVEL,
                    roles: roles,
                    nivel: nuevoUser.getDataValue("nivel"),
                };
            } catch (err) {
                return { estado: SubirNivelStatus.ERROR, roles: undefined, nivel: undefined };
            }
        } else {
            await user.update({ xp: nuevaXp });
            return { estado: SubirNivelStatus.EXITO, roles: undefined, nivel: undefined };
        }
    } catch (err) {
        return { estado: SubirNivelStatus.ERROR, roles: undefined, nivel: undefined };
    }
};

/**
 * Añade o quita roles según el nivel.
 *
 * Este código no se cuestiona, es un montón de basura infecta que funciona y devuelve any hasta en la sopa, pero typescript para alguna cosas es un dolor terrible y devolver un tipo variable es lo más coñazo que te puedes encontrar.
 *
 * @param member Usuario al que se añadirán/quitarán los roles
 * @param nivel Nivel al que está el usuario
 * @param forzar Añadir y eliminar o solo añadir de ser necesario
 * @returns
 */
export const asignarRoles = async (member: GuildMember, nivel: number, forzar: boolean) => {
    if (!forzar) {
        if (RecompensasNivel[nivel] && RecompensasNivel[nivel].length > 0) {
            await member.roles.add(RecompensasNivel[nivel]);
            return { asignados: RecompensasNivel[nivel], quitados: [] };
        }
    } else {
        let add = [],
            remove = [];
        const roles = member.roles.cache;

        for (const key in RecompensasNivel) {
            const lvl = Number(key);
            if (lvl <= nivel) {
                for (const rol of RecompensasNivel[lvl]) {
                    if (roles.find((v, k) => k === rol) === undefined) {
                        add.push(rol);
                    }
                }
            } else {
                for (const rol of RecompensasNivel[lvl]) {
                    if (roles.find((v, k) => k === rol) !== undefined) {
                        remove.push(rol);
                    }
                }
            }
        }

        if (add.length > 0) await member.roles.add(add);
        if (remove.length > 0) await member.roles.remove(remove);

        return { asignados: add, quitados: remove };
    }

    return { asignados: [], quitados: [] };
};

/**
 * Devulve un valor aleatorio de XP entre 10 y 20.
 *
 * @return {number} XP
 */
export const randomXp = (): number => {
    let min = 10,
        max = 20;
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
