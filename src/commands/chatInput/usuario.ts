import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { MClient } from "../../helpers/MClient";
import { TipoComandos, ComandoChatInput } from "../../types";
import { usuarioInfoController } from "../../helpers/comandos/usuario.helper";

const exp: ComandoChatInput = {
    tipo: TipoComandos.ChatInput,
    data: new SlashCommandBuilder()
        .setName("usuario")
        .setDescription("Comandos realicionados con usuarios!")
        .addSubcommand((sub) =>
            sub
                .setName("info")
                .setDescription("Muestra información sobre el usuario.")
                .addUserOption((user) =>
                    user
                        .setName("usuario")
                        .setDescription("Usuario del que se mostrará la información.")
                        .setRequired(true)
                )
        ),
    async execute(mcli: MClient, interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "info":
                usuarioInfoController(mcli, interaction);
                break;

            default:
                break;
        }
    },
};

module.exports = exp;
