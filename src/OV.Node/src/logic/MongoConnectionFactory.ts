import { MongoClient } from "mongodb";
import MongoConfigStorage from "./MongoConfigStorage"
import { logger } from "../utils/Logger";
class MongoConnectionFactory {

    public async isConnectionStringValid(name: string) {
        try {
            const uri = await MongoConfigStorage.getRealStringFromPseudo(name);

            const client = new MongoClient(uri);

            await client.connect();

            await client.db("admin").command({ ping: 1 });

            return true;
        }
        catch {
            return false;
        }
    }

    public async isInitialized(): Promise<boolean> {
        try{
            const client = await this.getConnection();

            await client.db("admin").command({ ping: 1 });

            return true;
        }
        catch{
            return false;
        }
    }

    public async getConnection(): Promise<MongoClient> {
        const {cfg} = await MongoConfigStorage.get();
        const uri = await MongoConfigStorage.getRealStringFromPseudo(cfg.name);

        const client = new MongoClient(uri);

        await client.connect();

        return client;
    }
}

export default new MongoConnectionFactory();