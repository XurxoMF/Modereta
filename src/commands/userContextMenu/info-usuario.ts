import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    UserContextMenuCommandInteraction,
    GuildMember,
} from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoUserContextMenu } from "../../types";
import { usuarioInfoController } from "../../helpers/commands/usuario.helper";
import { GestoresDeUsuarios } from "../../data/general.data";

const exp: ComandoUserContextMenu = {
    tipo: TipoComandos.UserContextMenu,
    data: new ContextMenuCommandBuilder().setName("Info").setType(ApplicationCommandType.User),
    async execute(mcli: MClient, interaction: UserContextMenuCommandInteraction) {
        const admin = (<GuildMember>interaction.member)["_roles"].some((roleId) =>
            GestoresDeUsuarios.some((rol) => roleId === rol)
        );

        usuarioInfoController(mcli, interaction, admin);
    },
};

module.exports = exp;
