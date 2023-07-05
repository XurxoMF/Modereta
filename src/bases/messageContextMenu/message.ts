import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoMessageContextMenu } from "../../types";

const exp: ComandoMessageContextMenu = {
    tipo: TipoComandos.MessageContextMenu,
    data: new ContextMenuCommandBuilder().setName("nombre").setType(ApplicationCommandType.Message),
    async execute(mcli: MClient, interaction: MessageContextMenuCommandInteraction) {
        // Código
    },
};

module.exports = exp;
