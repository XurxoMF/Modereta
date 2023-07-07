import {
    SlashCommandBuilder,
    ContextMenuCommandBuilder,
    ChatInputCommandInteraction,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import { MClient } from "./helpers/MClient";
import { db } from "./models";

export type DB = typeof db;

/**
 * Listado de tipos de comandos.
 */
export enum TipoComandos {
    ChatInput,
    MessageContextMenu,
}

/**
 * Interfaz base para los comandos. Esta engloba todos los tipos de comandos.
 */
export interface ComandoBase {
    tipo: TipoComandos;
    data:
        | OptionalExceptFor<SlashCommandBuilder, "name">
        | OptionalExceptFor<ContextMenuCommandBuilder, "name">;
    execute: any;
}

/**
 * Interfaz para los SlashCommands.
 *
 * @extends {ComandoBase}
 */
export interface ComandoChatInput extends ComandoBase {
    cooldown?: number;
    data: OptionalExceptFor<SlashCommandBuilder, "name">;
    execute: (mcli: MClient, interaction: ChatInputCommandInteraction) => void;
}

/**
 * Interfaz para los ContextMenuCommands de mensajes.
 *
 * @extends {ComandoBase}
 */
export interface ComandoMessageContextMenu extends ComandoBase {
    data: OptionalExceptFor<ContextMenuCommandBuilder, "name">;
    execute: (mcli: MClient, interaction: MessageContextMenuCommandInteraction) => void;
}

/**
 * Interfaz para las reacciones.
 *
 * @export
 * @interface Reaccion
 */
export interface Reaccion {
    nombre: string;
    desc: string;
    frase: string;
    gifs: string[];
}

/**
 * Interfaz para las acciones.
 *
 * @export
 * @interface Accion
 */
export interface Accion {
    nombre: string;
    desc: string;
    frase: string;
    gifs: string[];
}

/**
 * Marca todos los parámetros como opcionales a excepción de los elejidos.
 */
type OptionalExceptFor<T, TRequired extends keyof T = keyof T> = Partial<
    Pick<T, Exclude<keyof T, TRequired>>
> &
    Required<Pick<T, TRequired>>;
