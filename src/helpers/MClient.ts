import { Client, Collection, GatewayIntentBits } from "discord.js";
import { DB, ComandoChatInput, ComandoMessageContextMenu, ComandoUserContextMenu } from "../types";

/**
 * Cliente extdido para añadir nuevas propiedades al Client base de discord.js
 *
 * @export
 * @class MClient
 * @extends {Client}
 */
export class MClient extends Client {
    cooldowns!: Collection<any, any>;
    comandosChatImput!: Collection<string, ComandoChatInput>;
    comandosMessageContextMenu!: Collection<string, ComandoMessageContextMenu>;
    comandosUserContextMenu!: Collection<string, ComandoUserContextMenu>;
    db!: DB;

    constructor(
        intents: { intents: GatewayIntentBits[] },
        cooldowns: Collection<any, any>,
        comandosChatImput: Collection<string, ComandoChatInput>,
        comandosMessageContextMenu: Collection<string, ComandoMessageContextMenu>,
        comandosUserContextMenu: Collection<string, ComandoUserContextMenu>,
        database: DB
    ) {
        super(intents);
        this.cooldowns = cooldowns;
        this.comandosChatImput = comandosChatImput;
        this.comandosMessageContextMenu = comandosMessageContextMenu;
        this.comandosUserContextMenu = comandosUserContextMenu;
        this.db = database;
    }
}
