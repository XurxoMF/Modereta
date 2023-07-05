import { Client, Collection, GatewayIntentBits } from "discord.js";
import { db } from "../models/index";
import { Comando } from "../types";

export class MClient extends Client {
    cooldowns!: Collection<any, any>;
    comandos!: Collection<string, Comando>;
    db!: typeof db;

    constructor(
        intents: { intents: GatewayIntentBits[] },
        cooldowns: Collection<any, any>,
        comandos: Collection<string, Comando>,
        database: typeof db
    ) {
        super(intents);
        this.cooldowns = cooldowns;
        this.comandos = comandos;
        this.db = database;
    }
}
