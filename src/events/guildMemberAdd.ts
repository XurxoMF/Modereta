import { Events, GuildMember, EmbedBuilder, WebhookClient } from "discord.js";
import { MClient } from "../helpers/MClient";
import { Colores, ROL_MUTEO } from "../data/general.data";
import { WH_BIENVENIDAS } from "../config.json";
import { toggle } from "../helpers/SofiSeriesUsuariosPing.helper";
import { getMuteo } from "../helpers/Muteos.helper";

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(mcli: MClient, member: GuildMember) {
        const id = member.id;
        const avatar = member.displayAvatarURL();

        const bienvenida = new EmbedBuilder()
            .setTitle("BIENVENID@ A ASTRO VAPORWAVE")
            .setDescription(
                `<@${id}> te damos la bienvenida a Astro Vaporwave. 
                \nPuedes personalizar tus roles en <id:customize> y ocultar y mostrar canales a tu gusto en <id:browse>`
            )
            .setThumbnail(avatar)
            .setImage("https://i.postimg.cc/Bb11vF6q/fondo-saludo.gif")
            .setColor(Colores.EMBED_BASE);

        await new WebhookClient({ url: WH_BIENVENIDAS }).send({
            embeds: [bienvenida],
        });

        await toggle(mcli, id, true);

        // Muteo
        const muteado = await getMuteo(mcli, member.id);

        if (muteado === null) {
            await member.roles.add(["726143285545926736"]);
        } else {
            await member.roles.add([ROL_MUTEO]);
        }
    },
};
