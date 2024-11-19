import { NextFunction, Request, Response } from 'express';
import { ServerErrorModel } from '../Entities/ServerErrorModel';
import MongoConfigStorage from '../logic/MongoConfigStorage';
import MongoConnectionFactory from '../logic/MongoConnectionFactory';
import { MongoConfig } from '../models/MongoConfig';
import { logger } from '../utils/Logger';

class ConfigController {
  public save = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const configData: MongoConfig = req.body;
        
        if(await MongoConnectionFactory.isConnectionStringValid(configData.name)){
          await MongoConfigStorage.save(configData);
          res.json({
            isConfigured: await MongoConnectionFactory.isInitialized(),
            name: configData.name
          });
        } else{
          res.status(400).json({
            errors: ["Invalid connection string or server is unreachable"]
          } as ServerErrorModel)
        }
    } catch (error) {
        next(error);
    }
  };

  public status = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await MongoConfigStorage.get();
        
        res.json({
            isConfigured: await MongoConnectionFactory.isInitialized(),
            name: config.cfg.name,
            list: Object.keys(config.strings).map((value)=>({name:config.strings[value].name, value})),
            isConnectionStringEditLocked: config.cfg.isConnectionStringEditLocked
        });
      } catch (error) {
      next(error);
    }
  };
}

export default ConfigController;
