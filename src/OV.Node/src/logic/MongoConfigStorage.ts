import { ConfigFile, MongoConfig } from "../models/MongoConfig";
import fs from 'fs';
import util  from 'util';
import { writeFileAsyncRecursive } from "../utils/Utils";
import path from "path";
import { logger } from "../utils/Logger";

class MongoConfigStorage {
    private static readonly pathToConfig = path.join(process.cwd(), "cfg/config.json");
    private getConnectionStringFromEnv(): string | null {
        return process.env.MONGO_CONNECTION_STRING || null;
    }

    async getRealStringFromPseudo(name: string): Promise<string> {
        let out: string = ""
        try {
            const result = fs.readFileSync(MongoConfigStorage.pathToConfig);
            const list = JSON.parse(result.toString('utf8'))
            out = list.strings[name].url || ""
        } finally {
            return out
        }
    }
    
    async save(cfg: MongoConfig): Promise<void> {
        if(this.getConnectionStringFromEnv()){
            return;
        }
        await writeFileAsyncRecursive(MongoConfigStorage.pathToConfig, cfg);
    }

    async get() : Promise<ConfigFile> {
        try{
            const str = fs.readFileSync(MongoConfigStorage.pathToConfig);
            return JSON.parse(str.toString('utf8'));
        }
        catch{
            return {
                strings: {},
                cfg: {
                    name: "",
                    isConnectionStringEditLocked: false
                }
            };
        }
    }

    
}

export default new MongoConfigStorage();