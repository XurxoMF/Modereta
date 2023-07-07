import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoUserContextMenu } from "../../types";
import { usuarioInfoController } from "../../helpers/comandos/usuario.helper";

const exp: ComandoUserContextMenu = {
    tipo: TipoComandos.UserContextMenu,
    data: new ContextMenuCommandBuilder().setName("Info").setType(ApplicationCommandType.User),
    async execute(mcli: MClient, interaction: UserContextMenuCommandInteraction) {
        usuarioInfoController(mcli, interaction);
    },
};

module.exports = exp;
