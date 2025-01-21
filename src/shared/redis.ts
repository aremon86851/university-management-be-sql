import { createClient } from 'redis';
import { logger } from './logger';

const redisClient = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', err => logger.error('Redis error', err));
redisClient.on('connect', () => logger.info('Redis connected successfully'));

const connect = async (): Promise<void> => {
  await redisClient.connect();
};

export const RedisClient = {
  connect,
};
