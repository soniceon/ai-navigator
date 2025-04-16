const NodeCache = require('node-cache');

// 创建缓存实例
const cache = new NodeCache({
    stdTTL: 600, // 默认缓存时间（秒）
    checkperiod: 120 // 定期检查过期缓存的时间（秒）
});

// 缓存中间件
const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        // 只缓存GET请求
        if (req.method !== 'GET') {
            return next();
        }

        // 生成缓存键
        const key = req.originalUrl || req.url;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            return res.json(cachedResponse);
        }

        // 重写res.json方法以缓存响应
        const originalJson = res.json;
        res.json = (body) => {
            cache.set(key, body, duration || 600);
            originalJson.call(res, body);
        };

        next();
    };
};

// 清除缓存中间件
const clearCache = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        cache.flushAll();
    }
    next();
};

module.exports = {
    cacheMiddleware,
    clearCache
}; 