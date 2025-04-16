const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const { limiter, uploadLimiter } = require('./middleware/rateLimit');
const { requestLogger, errorLogger } = require('./middleware/logger');
require('dotenv').config();

const app = express();

// 安全中间件
app.use(helmet());
app.use(compression());

// 基础中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志中间件
app.use(requestLogger);

// 应用全局速率限制
app.use(limiter);

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 连接数据库
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('数据库连接成功'))
    .catch(err => console.error('数据库连接失败:', err));

// 路由
const toolRoutes = require('./routes/toolRoutes');
const userRoutes = require('./routes/userRoutes');

// 应用路由
app.use('/api/tools', toolRoutes);
app.use('/api/users', userRoutes);

// 错误处理中间件
app.use(errorLogger);
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // 处理文件上传错误
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: '文件大小超过限制' });
    }
    if (err.code === 'LIMIT_FILE_TYPE') {
        return res.status(400).json({ message: '不支持的文件类型' });
    }
    
    res.status(500).json({ message: '服务器错误' });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({ message: '未找到请求的资源' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 