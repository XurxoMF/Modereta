import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoUserContextMenu } from "../../types";

const exp: ComandoUserContextMenu = {
    tipo: TipoComandos.UserContextMenu,
    data: new ContextMenuCommandBuilder().setName("nombre").setType(ApplicationCommandType.User),
    async execute(mcli: MClient, interaction: UserContextMenuCommandInteraction) {
        // CÓDIGO
    },
};

module.exports = exp;
