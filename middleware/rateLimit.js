const rateLimit = require('express-rate-limit');

// 创建速率限制器
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP在15分钟内最多100个请求
    message: '请求过于频繁，请稍后再试',
    standardHeaders: true, // 返回速率限制信息在 `RateLimit-*` headers中
    legacyHeaders: false, // 禁用 `X-RateLimit-*` headers
});

// 文件上传速率限制
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1小时
    max: 10, // 限制每个IP在1小时内最多10个上传请求
    message: '上传请求过于频繁，请稍后再试',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    limiter,
    uploadLimiter
}; 