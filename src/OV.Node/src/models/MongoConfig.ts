export interface MongoConfig {
    name: string;
    isConnectionStringEditLocked: boolean
}

export interface ConfigFile {
    strings: Record<string, {
        name: string,
        url: string
    }>,
    cfg: MongoConfig
}