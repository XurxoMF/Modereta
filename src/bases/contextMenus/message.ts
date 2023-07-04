import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import { MClient } from "../../helpers/MClient";

module.exports = {
    data: new ContextMenuCommandBuilder().setName("nombre").setType(ApplicationCommandType.Message),
    async execute(mcli: MClient, interaction: ChatInputCommandInteraction) {
        // Código
    },
};
