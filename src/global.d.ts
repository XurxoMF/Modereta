declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN_DEV: string;
            TOKEN_PROD: string;
            DEV: boolean;
            CLIENT_ID_DEV: string;
            CLIENT_ID_PROD: string;
            GUILD_ID: string;
            XURXOMF_ID: string;
        }
    }
}

export {};
