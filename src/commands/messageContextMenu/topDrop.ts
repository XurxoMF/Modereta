import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    MessageContextMenuCommandInteraction,
    EmbedBuilder,
    EmbedAssetData,
    Attachment,
    WebhookClient,
} from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoMessageContextMenu } from "../../types";
import { Colores } from "../../data/general.data";
import { WH_SOFI_TOP_DROPS } from "../../config.json";
const SOFI_ID = "853629533855809596";

const exp: ComandoMessageContextMenu = {
    tipo: TipoComandos.MessageContextMenu,
    data: new ContextMenuCommandBuilder()
        .setName("Top Drop")
        .setType(ApplicationCommandType.Message),
    async execute(mcli: MClient, interaction: MessageContextMenuCommandInteraction) {
        const msg = interaction.targetMessage;

        if (msg.author.id === SOFI_ID) {
            let top = false;
            let embed = new EmbedBuilder()
                .setTitle("IR AL DROP")
                .setURL(`https://discord.com/channels/${msg.guildId}/${msg.channelId}/${msg.id}`)
                .setColor(Colores.EMBED_BASE);

            if (msg.embeds.length > 0) {
                if (msg.embeds[0].title === "SOFI: MINIGAME") {
                    embed
                        .setTitle("SOFI: MINIJUEGO")
                        .setImage((<EmbedAssetData>msg.embeds[0].image).url);
                    top = true;
                } else if (msg.embeds[0].title === "Captcha Drop") {
                    embed
                        .setTitle("SOFI: CAPTCHA DROP")
                        .setImage((<EmbedAssetData>msg.embeds[0].image).url);
                    top = true;
                }
            } else {
                if (
                    msg.content.includes("is dropping the cards") ||
                    msg.content.includes("Your extra drop is being used") ||
                    msg.content.includes("dropped the cards")
                ) {
                    embed
                        .setTitle("SOFI: DROP DE USUARIO")
                        .setDescription(msg.content.split("\n")[0])
                        .setImage((<Attachment>msg.attachments.at(0)).url);
                    top = true;
                } else if (msg.content === "**Series drop**") {
                    embed
                        .setTitle("SOFI: DROP DE SERIES")
                        .setImage((<Attachment>msg.attachments.at(0)).url);
                    top = true;
                }
            }

            if (top) {
                const wh = new WebhookClient({ url: WH_SOFI_TOP_DROPS });
                try {
                    await wh.send({
                        embeds: [embed],
                    });
                    msg.react(`⭐`);
                    interaction.reply({
                        content: `> <@${interaction.user.id}> Marcado como **⭐ Top Drop**!`,
                        ephemeral: true,
                    });
                } catch (error) {
                    interaction.reply({
                        content: `> <@${interaction.user.id}> Ha ocurrido un error al marcar el Top Drop!`,
                    });
                }
            }
        } else {
            interaction.reply({
                content: `> <@${interaction.user.id}> Eso no es un drop de ningún bot!`,
                ephemeral: true,
            });
        }
    },
};

module.exports = exp;
