const express = require('express');
const router = express.Router();
const ToolController = require('../controllers/ToolController');
const { check, body } = require('express-validator');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimit');
const { cacheMiddleware, clearCache } = require('../middleware/cache');

// 验证中间件
const validateTool = [
    check('name')
        .notEmpty().withMessage('名称不能为空')
        .isLength({ min: 2, max: 50 }).withMessage('名称长度必须在2-50个字符之间')
        .trim(),
    check('description')
        .notEmpty().withMessage('描述不能为空')
        .isLength({ min: 10, max: 1000 }).withMessage('描述长度必须在10-1000个字符之间')
        .trim(),
    check('category')
        .notEmpty().withMessage('分类不能为空')
        .isIn(['文本生成', '图像生成', '视频生成', '音频生成', '代码生成', '数据分析', '其他'])
        .withMessage('无效的分类'),
    check('url')
        .isURL().withMessage('请输入有效的URL')
        .matches(/^https?:\/\//).withMessage('URL必须以http://或https://开头'),
    check('features')
        .isArray().withMessage('功能必须是数组')
        .notEmpty().withMessage('至少需要一个功能'),
    check('pricing.free')
        .isBoolean().withMessage('免费字段必须是布尔值'),
    check('pricing.plans')
        .isArray().withMessage('价格计划必须是数组'),
    check('pricing.plans.*.name')
        .notEmpty().withMessage('计划名称不能为空')
        .trim(),
    check('pricing.plans.*.price')
        .isNumeric().withMessage('价格必须是数字')
        .isFloat({ min: 0 }).withMessage('价格不能为负数'),
    check('tutorials.*.title')
        .optional()
        .notEmpty().withMessage('教程标题不能为空')
        .trim(),
    check('tutorials.*.content')
        .optional()
        .notEmpty().withMessage('教程内容不能为空')
        .trim(),
    check('tutorials.*.videoUrl')
        .optional()
        .isURL().withMessage('请输入有效的视频URL')
];

const validateReview = [
    check('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('评分必须在1-5之间'),
    check('comment')
        .notEmpty()
        .withMessage('评价内容不能为空')
        .isLength({ max: 500 })
        .withMessage('评价内容不能超过500字')
        .trim()
];

// 公开路由（添加缓存）
router.get('/', cacheMiddleware(300), ToolController.getAllTools);
router.get('/categories', cacheMiddleware(3600), ToolController.getCategories);
router.get('/popular', cacheMiddleware(1800), ToolController.getPopularTools);
router.get('/latest', cacheMiddleware(1800), ToolController.getLatestTools);
router.get('/:id', cacheMiddleware(600), ToolController.getToolById);

// 需要认证的路由
router.post('/:id/reviews', [auth, validateReview], ToolController.addReview);

// 管理员路由（添加缓存清除）
router.post('/', 
    [auth, admin, uploadLimiter, upload.single('image'), validateTool, clearCache], 
    ToolController.createTool
);
router.put('/:id', 
    [auth, admin, uploadLimiter, upload.single('image'), validateTool, clearCache], 
    ToolController.updateTool
);
router.delete('/:id', [auth, admin, clearCache], ToolController.deleteTool);

module.exports = router; 