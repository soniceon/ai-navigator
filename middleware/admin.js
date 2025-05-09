module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: '未认证' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '需要管理员权限' });
    }

    next();
}; 