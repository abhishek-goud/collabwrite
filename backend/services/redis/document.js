const getRedisClient = require("../../config");
const { getDocById } = require("../db/document");

/** @type {import("redis").RedisClientType} */
let redisClient;

const getCachedDocById = async (documentId) => {
  try {
    redisClient = await getRedisClient();
    const data = await redisClient.hGetAll(`doc:${documentId}`);
    if (!data || Object.keys(data).length === 0) return null;

    return {
      ...data,
      cursors: data.cursors ? JSON.parse(data.cursors) : [],
    };
  } catch (error) {
    console.log("Error fetching from cache");
    throw new Error("Error fetching from cache");
  }
};

const setDocInCache = async (documentId, data) => {
  try {
    console.log({ documentId }, { data });
    redisClient = await getRedisClient();
    if (redisClient) console.log("redis is not null", redisClient);
    // const data = await getDocById(documentId);
    console.log("yoooooooooooooooo");
    await redisClient.hSet(`document:${documentId}`, {
      content: data.content,
      cursors: JSON.stringify([]),
      title: data.title,
      createdAt:  data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    });
    console.log("boooooooo");
  } catch (error) {
    throw new Error("Error caching document", error);
  }
};

const setUserInfoInCache = async (socketId, userId, documentId) => {
  try {
    redisClient = await getRedisClient();
    await redisClient.hSet(`socket:${socketId}`, {
      userId: userId,
      documentId: documentId,
    });
  } catch (error) {
    throw new Error("Error caching user info", error);
  }
};

const getCachedUserInfo = async (socketId) => {
  try {
    redisClient = await getRedisClient();
    const userInfo = await redisClient.hGetAll(`socket:${socketId}`)
    // console.log({userInfo}) 
    return userInfo || null;
  } catch (error) {
    throw new Error("Error fetching user info from cache", error);
  }
};

module.exports = {
  getCachedDocById,
  setDocInCache,
  setUserInfoInCache,
  getCachedUserInfo,
};
