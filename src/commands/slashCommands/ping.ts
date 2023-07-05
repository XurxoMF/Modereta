import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { MClient } from "../../helpers/MClient";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder().setName("ping").setDescription("Responde con pong!"),
    async execute(mcli: MClient, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`Pong! Client ${ping}ms | Websocket: ${mcli.ws.ping}ms`);
    },
};
