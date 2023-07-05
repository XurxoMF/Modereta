import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoChatInput } from "../../types";

const exp: ComandoChatInput = {
    tipo: TipoComandos.ChatInput,
    cooldown: 10,
    data: new SlashCommandBuilder().setName("nombre").setDescription("Descripción!"),
    async execute(mcli: MClient, interaction: ChatInputCommandInteraction) {
        // Código
    },
};

module.exports = exp;
