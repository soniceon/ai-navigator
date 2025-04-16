const Tool = require('../models/Tool');

class ToolService {
    // 获取所有工具
    async getAllTools(page = 1, limit = 10, category = null, search = '') {
        const query = {};
        
        if (category) {
            query.category = category;
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tools = await Tool.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('reviews.user', 'username avatar');

        const total = await Tool.countDocuments(query);

        return {
            tools,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    // 获取单个工具
    async getToolById(id) {
        const tool = await Tool.findById(id)
            .populate('reviews.user', 'username avatar');
        
        if (!tool) {
            throw new Error('工具不存在');
        }

        // 增加浏览次数
        tool.viewCount += 1;
        await tool.save();

        return tool;
    }

    // 创建工具
    async createTool(toolData) {
        const tool = new Tool(toolData);
        return await tool.save();
    }

    // 更新工具
    async updateTool(id, toolData) {
        const tool = await Tool.findByIdAndUpdate(
            id,
            { $set: toolData },
            { new: true, runValidators: true }
        );

        if (!tool) {
            throw new Error('工具不存在');
        }

        return tool;
    }

    // 删除工具
    async deleteTool(id) {
        const tool = await Tool.findByIdAndDelete(id);
        
        if (!tool) {
            throw new Error('工具不存在');
        }

        return tool;
    }

    // 添加评价
    async addReview(toolId, userId, reviewData) {
        const tool = await Tool.findById(toolId);
        
        if (!tool) {
            throw new Error('工具不存在');
        }

        // 检查用户是否已经评价过
        const existingReview = tool.reviews.find(
            review => review.user.toString() === userId.toString()
        );

        if (existingReview) {
            throw new Error('您已经评价过该工具');
        }

        tool.reviews.push({
            user: userId,
            ...reviewData
        });

        // 重新计算评分
        const totalRating = tool.reviews.reduce((sum, review) => sum + review.rating, 0);
        tool.rating = totalRating / tool.reviews.length;

        return await tool.save();
    }

    // 获取工具分类
    async getCategories() {
        return await Tool.distinct('category');
    }

    // 获取热门工具
    async getPopularTools(limit = 5) {
        return await Tool.find()
            .sort({ viewCount: -1, rating: -1 })
            .limit(limit)
            .populate('reviews.user', 'username avatar');
    }

    // 获取最新工具
    async getLatestTools(limit = 5) {
        return await Tool.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('reviews.user', 'username avatar');
    }
}

module.exports = new ToolService(); 