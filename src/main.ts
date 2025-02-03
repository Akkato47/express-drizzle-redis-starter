import type { NextFunction, Request, Response } from 'express';
import type http from 'node:http';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import config from './config';
import redisClient from './db/redis';
import { logger, LoggerStream } from './lib/loger';
import router from './modules/main.router';
import swaggerDocument from './swagger.json';
import { CustomError } from './utils/custom_error';

export const app = express();
const port = config.app.port;

export const DI = {} as {
  server: http.Server;
};

export const init = (async () => {
  swaggerDocument.host =
    config.app.isProduction && !config.app.isLocale
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

  app.use((err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error.';
    logger.error(message);
    _next();
    res.status(statusCode).json({ success: false, message });
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack);
    next();
    res.status(500).send('Something broke!');
  });
  redisClient.connect();

  DI.server = app.listen(port, () => logger.info(`listening in port:${port}`));
})();
