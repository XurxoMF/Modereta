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

export {};
