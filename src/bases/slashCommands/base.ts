import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { MClient } from "../../helpers/MClient";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder().setName("nombre").setDescription("Descripción!"),
    async execute(mcli: MClient, interaction: ChatInputCommandInteraction) {
        // Código
    },
};
