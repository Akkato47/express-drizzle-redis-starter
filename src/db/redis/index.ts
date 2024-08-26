import config from "@/config";
import * as Redis from "redis";

const redisClient: Redis.RedisClientType = Redis.createClient({
    password: config.database.redis.password,
    socket: {
        host: config.database.redis.host,
        port: +config.database.redis.port,
    },
});

redisClient.on("error", (err) => console.log("Redis Client Error: ", err));

export default redisClient;
