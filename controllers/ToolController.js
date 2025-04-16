const ToolService = require('../services/ToolService');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

class ToolController {
    // 获取所有工具
    async getAllTools(req, res) {
        try {
            const { page = 1, limit = 10, category, search } = req.query;
            const result = await ToolService.getAllTools(
                parseInt(page),
                parseInt(limit),
                category,
                search
            );
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // 获取单个工具
    async getToolById(req, res) {
        try {
            const tool = await ToolService.getToolById(req.params.id);
            res.json(tool);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    // 创建工具
    async createTool(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // 如果上传了文件但验证失败，删除上传的文件
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({ errors: errors.array() });
            }

            const toolData = {
                ...req.body,
                image: req.file ? path.basename(req.file.path) : 'default-tool.png'
            };

            const tool = await ToolService.createTool(toolData);
            res.status(201).json(tool);
        } catch (error) {
            // 如果创建失败，删除上传的文件
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(400).json({ message: error.message });
        }
    }

    // 更新工具
    async updateTool(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // 如果上传了文件但验证失败，删除上传的文件
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({ errors: errors.array() });
            }

            const toolData = { ...req.body };
            
            // 如果上传了新图片，更新图片路径
            if (req.file) {
                toolData.image = path.basename(req.file.path);
                
                // 获取旧工具信息
                const oldTool = await ToolService.getToolById(req.params.id);
                
                // 如果旧图片不是默认图片，删除旧图片
                if (oldTool.image !== 'default-tool.png') {
                    const oldImagePath = path.join(__dirname, '../uploads', oldTool.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
            }

            const tool = await ToolService.updateTool(req.params.id, toolData);
            res.json(tool);
        } catch (error) {
            // 如果更新失败，删除上传的文件
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(404).json({ message: error.message });
        }
    }

    // 删除工具
    async deleteTool(req, res) {
        try {
            const tool = await ToolService.deleteTool(req.params.id);
            
            // 删除工具图片
            if (tool.image !== 'default-tool.png') {
                const imagePath = path.join(__dirname, '../uploads', tool.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            
            res.json({ message: '工具已删除' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    // 添加评价
    async addReview(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const tool = await ToolService.addReview(
                req.params.id,
                req.user.id,
                req.body
            );
            res.json(tool);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // 获取工具分类
    async getCategories(req, res) {
        try {
            const categories = await ToolService.getCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // 获取热门工具
    async getPopularTools(req, res) {
        try {
            const tools = await ToolService.getPopularTools();
            res.json(tools);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // 获取最新工具
    async getLatestTools(req, res) {
        try {
            const tools = await ToolService.getLatestTools();
            res.json(tools);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ToolController(); 