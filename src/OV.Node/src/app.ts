import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import Route from './interfaces/Route';
import MongoConnectionFactory from './logic/MongoConnectionFactory';
import errorMiddleware from './middlewares/ErrorMiddleware';
import { logger, stream } from './utils/Logger';
import ResponseUtils from './utils/ResponseUtils';
import favicon from 'serve-favicon'

class App {
  public app: express.Application;
  public port: number;
  public env: string;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;
    this.env = process.env.NODE_ENV || 'development';
    this.app.use(favicon(path.join(__dirname, "public/favicon.png")))
    this.app.use(express.static(path.join(__dirname, '/assets')));
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.app.use('/db', App.asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      const connection = ResponseUtils.getMongoConnection(res);
      await connection.close();
      next();
    }));
    this.app.get('*', function (request, response) {
      response.sendFile(path.join(__dirname, "assets/index.html"));
    });
    
    this.initializeErrorHandling();

  }

  public listen() {
    this.app.listen(this.port, "0.0.0.0", () => {
      logger.info(`App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }
  static asyncMiddleware = fn =>
    (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next))
        .catch(next);
    };
  private initializeMiddlewares() {
    if (this.env === 'production') {
      // this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    } else if (this.env === 'development') {
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    

    this.app.use('/db', App.asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      const connection = await MongoConnectionFactory.getConnection();
      ResponseUtils.setMongoConnection(res, connection);
      next();
    }));

   
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }


  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
