require("dotenv").config();
const { createClient } = require("redis");

let redisClientInstance = null;

const redisConnect = async () => {
  const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));
  client.on("connect", () => console.log("Redis Client Connected"));

  await client.connect();
  return client;
};

const getRedisClient = async () => {
  if (!redisClientInstance) {
    redisClientInstance = await redisConnect();
  }

  return redisClientInstance;
};

module.exports = getRedisClient;
