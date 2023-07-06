import { Client, Collection, GatewayIntentBits } from "discord.js";
import { DB, ComandoChatInput, ComandoMessageContextMenu } from "../types";

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
    db!: DB;

    constructor(
        intents: { intents: GatewayIntentBits[] },
        cooldowns: Collection<any, any>,
        comandosChatImput: Collection<string, ComandoChatInput>,
        comandosMessageContextMenu: Collection<string, ComandoMessageContextMenu>,
        database: DB
    ) {
        super(intents);
        this.cooldowns = cooldowns;
        this.comandosChatImput = comandosChatImput;
        this.comandosMessageContextMenu = comandosMessageContextMenu;
        this.db = database;
    }
}
