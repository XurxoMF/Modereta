import { Client, Collection, GatewayIntentBits } from "discord.js";
import { db } from "../models/index";
import { ComandoChatInput, ComandoMessageContextMenu } from "../types";

export class MClient extends Client {
    cooldowns!: Collection<any, any>;
    comandosChatImput!: Collection<string, ComandoChatInput>;
    comandosMessageContextMenu!: Collection<string, ComandoMessageContextMenu>;
    db!: typeof db;

    constructor(
        intents: { intents: GatewayIntentBits[] },
        cooldowns: Collection<any, any>,
        comandosChatImput: Collection<string, ComandoChatInput>,
        comandosMessageContextMenu: Collection<string, ComandoMessageContextMenu>,
        database: typeof db
    ) {
        super(intents);
        this.cooldowns = cooldowns;
        this.comandosChatImput = comandosChatImput;
        this.comandosMessageContextMenu = comandosMessageContextMenu;
        this.db = database;
    }
}
