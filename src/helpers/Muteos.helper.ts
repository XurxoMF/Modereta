import { Muteos } from "../models/Muteos.model";
import { MClient } from "./MClient";
import { DEV, WH_DEV, WH_SANCIONES } from "../config.json";
import { Colores, ROL_MUTEO } from "../data/general.data";
import { EmbedBuilder, GuildMember, WebhookClient } from "discord.js";
import { Op } from "sequelize";

/**
 * Mutea a un usuario y envía un mensaje en el canal de sanciones.
 *
 * @param {MClient} mcli
 * @param {string} motivo Motivo del muteo
 * @param {number} hasta Date().getTime() de cuando se le quitará el muteo
 * @param {GuildMember} member Usuario muteado
 * @param {GuildMember} moderador Moderador que lo ha muteado
 * @return {Promise<Muteos>} Registo de la db o null si el usuario ya está muteado
 */
export const mutear = async (
    mcli: MClient,
    motivo: string,
    hasta: number,
    member: GuildMember,
    moderador: GuildMember
): Promise<Muteos | null> => {
    const muteado = await mcli.db.Muteos.count({ where: { idUsuario: member.id, muteado: true } });

    if (muteado > 0) return null;

    const muteo = await mcli.db.Muteos.create({
        idUsuario: member.id,
        motivo: motivo,
        roles: member["_roles"].join(","),
        fin: hasta,
        muteado: true,
    });

    member.roles.set([ROL_MUTEO]);

    const wh = new WebhookClient({ url: DEV ? WH_DEV : WH_SANCIONES });

    const hastaTimestamp = `<t:${Math.floor(hasta / 1000)}:F>`;

    const embed = new EmbedBuilder()
        .setTitle("Usuario Muteado")
        .setDescription(
            `- **Usuario:** <@${member.id}>\n- **Motivo:** ${motivo}\n- **Hasta:** ${
                hasta === 0 ? "`Indefinadamente`" : hastaTimestamp
            }`
        )
        .setFooter({
            text: moderador.displayName,
            iconURL: moderador.displayAvatarURL(),
        })
        .setTimestamp(Date.now())
        .setColor(Colores.MUTEOS);

    await wh.send({ content: `<@${member.id}>`, embeds: [embed] });

    return muteo;
};

/**
 * Desmutea a un usuario y envía un mensaje en el canal de sanciones.
 *
 * @param {MClient} mcli
 * @param {GuildMember} member Usuario desmuteado
 * @param {string} motivo Motivo del desmuteo.
 * @param {GuildMember} moderador Moderador que ha desmuteado al usuario.
 * @return {Promise<Muteos | null>}  Registro del antiguo muteo o null si no estaba muteado.
 */
export const desmutear = async (
    mcli: MClient,
    member: GuildMember,
    motivo: string,
    moderador: GuildMember
): Promise<Muteos | null> => {
    const muteo = await mcli.db.Muteos.findOne({ where: { idUsuario: member.id, muteado: true } });

    if (muteo === null) return null;

    const desmuteo = await muteo.update({ muteado: false });

    member.roles.set(muteo.roles.split(","));

    const wh = new WebhookClient({ url: DEV ? WH_DEV : WH_SANCIONES });

    const embed = new EmbedBuilder()
        .setTitle("Usuario Desmuteado")
        .setDescription(`- **Usuario:** <@${member.id}>\n- **Motivo:** ${motivo}`)
        .setFooter({
            text: moderador.displayName,
            iconURL: moderador.displayAvatarURL(),
        })
        .setTimestamp(Date.now())
        .setColor(Colores.SANCION_ELIMINADA);

    await wh.send({ content: `<@${member.id}>`, embeds: [embed] });

    return desmuteo;
};

/**
 * Comprueba si un usuario está muteado.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario que se quiere comprovar.
 * @return {Promise<boolean>}  Si está muteado o no.
 */
export const muteado = async (mcli: MClient, idUsuario: string): Promise<boolean> => {
    const muteo = await mcli.db.Muteos.count({ where: { idUsuario: idUsuario, muteado: true } });

    return muteo > 0;
};

/**
 * Busca todos los muteos activos y pasados de un usuario y los cuenta.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se buscarán los muteos.
 * @return {Promise<{ count: number; rows: Muteos[] }>} Recuento y muteos del usuario.
 */
export const getMuteosCount = async (
    mcli: MClient,
    idUsuario: string
): Promise<{ count: number; rows: Muteos[] }> => {
    return await mcli.db.Muteos.findAndCountAll({ where: { idUsuario: idUsuario } });
};

/**
 * Busca todos los muteos activos.
 *
 * @param {MClient} mcli
 * @return {Promise<Muteos[]>} Muteos activos
 */
export const getMuteosActivosTerminados = async (mcli: MClient): Promise<Muteos[]> => {
    return await mcli.db.Muteos.findAll({
        where: { muteado: true, fin: { [Op.and]: [{ [Op.gt]: 0 }, { [Op.lte]: Date.now() }] } },
    });
};

/**
 * Busca un muteo activo para el usuario.
 *
 * @param {MClient} mcli
 * @param {string} idUsuario Usuario del que se buscará un muteo activo.
 * @return {Promise<Muteos | null>} Muteo activo o null si no está muteado.
 */
export const getMuteo = async (mcli: MClient, idUsuario: string): Promise<Muteos | null> => {
    return await mcli.db.Muteos.findOne({ where: { idUsuario: idUsuario, muteado: true } });
};
