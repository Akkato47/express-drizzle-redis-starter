import cors from 'cors';
import router from './modules/main.router';

import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import config from './config';
import { logger, LoggerStream } from './lib/loger';
import { CustomError } from './utils/custom_error';
import redisClient from './db/redis';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import type http from 'http';
import morgan from 'morgan';

export const app = express();
const port = config.app.port;

export const DI = {} as {
  server: http.Server;
};

export const init = (async () => {
  swaggerDocument.host = config.app.isProduction
    ? config.app.productionUrl
    : `localhost:${port}`;

  app.use(cors(config.cors));
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan('dev', { stream: new LoggerStream() }));
  app.use('/api', router);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new CustomError(404, `endpoint ${_req.path} not found`));
  });

  app.use(
    (err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal Server Error.';
      logger.error(message);
      _next();
      return res.status(statusCode).json({ success: false, message });
    }
  );

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack);
    next();
    res.status(500).send('Something broke!');
  });
  redisClient.connect();

  DI.server = app.listen(port, () => logger.info(`listening in port:${port}`));
})();
