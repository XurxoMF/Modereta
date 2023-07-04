import { Client, Collection, GatewayIntentBits } from "discord.js";
import { db } from "../models/index";

export class MClient extends Client {
    cooldowns!: Collection<any, any>;
    comandos!: Collection<any, any>;
    db!: typeof db;

    constructor(
        intents: { intents: GatewayIntentBits[] },
        cooldowns: Collection<any, any>,
        comandos: Collection<any, any>,
        database: typeof db
    ) {
        super(intents);
        this.cooldowns = cooldowns;
        this.comandos = comandos;
        this.db = database;
    }
}
