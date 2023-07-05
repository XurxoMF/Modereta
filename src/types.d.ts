import {
    Client,
    Collection,
    SlashCommandBuilder,
    ContextMenuCommandBuilder,
    CommandInteraction,
} from "discord.js";
import { MClient } from "./helpers/MClient";

export interface Comando {
    data: SlashCommandBuilder | ContextMenuCommandBuilder;
    cooldown?: number;
    execute: (mcli: MClient, interaction: CommandInteraction) => void;
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
