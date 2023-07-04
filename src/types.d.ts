import {
    Client,
    Collection,
    SlashCommandBuilder,
    ContextMenuCommandBuilder,
    CommandInteraction,
} from "discord.js";

export interface Comando {
    data: SlashCommandBuilder | ContextMenuCommandBuilder;
    cooldown?: number;
    execute: (bot: Bot, interaction: CommandInteraction) => void;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            DEV: boolean;
            CLIENT_ID: string;
            GUILD_ID: string;
        }
    }
}
