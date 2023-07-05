import {
    Client,
    Collection,
    SlashCommandBuilder,
    ContextMenuCommandBuilder,
    ChatInputCommandInteraction,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import { MClient } from "./helpers/MClient";

export enum TipoComandos {
    ChatInput,
    MessageContextMenu,
}

export interface ComandoBase {
    tipo: TipoComandos;
    data: SlashCommandBuilder | ContextMenuCommandBuilder;
    execute: any;
}

export interface ComandoChatInput extends ComandoBase {
    data: SlashCommandBuilder;
    cooldown?: number;
    execute: (mcli: MClient, interaction: ChatInputCommandInteraction) => void;
}

export interface ComandoMessageContextMenu extends ComandoBase {
    data: ContextMenuCommandBuilder;
    execute: (mcli: MClient, interaction: MessageContextMenuCommandInteraction) => void;
}
