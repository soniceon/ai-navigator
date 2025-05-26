import { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(config: RateLimitConfig) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const key = `${ip}-${req.url}`;
    const now = Date.now();

    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + config.windowMs
      };
    } else {
      store[key].count++;
    }

    if (store[key].count > config.max) {
      return res.status(429).json({
        message: 'Too many requests, please try again later'
      });
    }

    next();
  };
}

// 清理过期的记录
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (now > store[key].resetTime) {
      delete store[key];
    }
  });
}, 60000); // 每分钟清理一次 