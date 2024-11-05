import config from '@/config';
import { logger } from '@/lib/loger';
import * as Redis from 'redis';

const redisClient: Redis.RedisClientType = Redis.createClient({
  password: config.database.redis.password,
  socket: {
    host: config.database.redis.host,
    port: +config.database.redis.port,
  },
});

redisClient.on('error', (err) => logger.error(`Redis Client Error: ${err}`));

export default redisClient;
