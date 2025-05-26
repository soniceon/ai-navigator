import type { NextApiRequest, NextApiResponse } from 'next';
import { JwtUtil } from '../../../utils/jwtUtil';
import { UserService } from '../../../utils/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const lang = req.headers['accept-language']?.split(',')[0] || 'zh';
  const msg = (en: string, zh: string) => lang.startsWith('zh') ? zh : en;

  // 校验请求方法
  if (!['GET', 'POST', 'DELETE'].includes(req.method || '')) {
    return res.status(405).json({ code: 'METHOD_NOT_ALLOWED', message: msg('Method not allowed', '方法不被允许') });
  }

  // 获取 token
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: msg('Unauthorized', '未授权') });
  }

  // 校验 token 并获取用户信息
  const jwtUtil = JwtUtil.getInstance();
  const decoded = jwtUtil.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ code: 'INVALID_TOKEN', message: msg('Invalid token', '无效的令牌') });
  }

  const userService = UserService.getInstance();
  const user = await userService.findById(decoded.userId);
  if (!user) {
    return res.status(404).json({ code: 'USER_NOT_FOUND', message: msg('User not found', '用户不存在') });
  }

  // 初始化用户收藏数组（如果不存在）
  if (!user.favorites) {
    user.favorites = [];
    await userService.updateProfile(user.id, { favorites: [] });
  }

  // 根据请求方法处理收藏
  switch (req.method) {
    case 'GET':
      return res.status(200).json({ code: 'SUCCESS', favorites: user.favorites });
    case 'POST':
      const { toolId } = req.body;
      if (!toolId) {
        return res.status(400).json({ code: 'MISSING_FIELDS', message: msg('Missing toolId', '缺少工具ID') });
      }
      if (!user.favorites.includes(toolId)) {
        user.favorites.push(toolId);
        await userService.updateProfile(user.id, { favorites: user.favorites });
      }
      return res.status(200).json({ code: 'SUCCESS', favorites: user.favorites });
    case 'DELETE':
      const { toolId: removeToolId } = req.body;
      if (!removeToolId) {
        return res.status(400).json({ code: 'MISSING_FIELDS', message: msg('Missing toolId', '缺少工具ID') });
      }
      user.favorites = user.favorites.filter(id => id !== removeToolId);
      await userService.updateProfile(user.id, { favorites: user.favorites });
      return res.status(200).json({ code: 'SUCCESS', favorites: user.favorites });
    default:
      return res.status(405).json({ code: 'METHOD_NOT_ALLOWED', message: msg('Method not allowed', '方法不被允许') });
  }
} 