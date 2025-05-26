import { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../utils/userService';
import { JwtUtil } from '../../../utils/jwtUtil';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 验证用户是否已登录
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: '未登录' });
  }

  const decoded = JwtUtil.getInstance().validateToken(token);
  if (!decoded) {
    return res.status(401).json({ message: '登录已过期' });
  }

  const userService = UserService.getInstance();

  switch (req.method) {
    case 'GET':
      try {
        const user = await userService.findById(decoded.userId);
        if (!user) {
          return res.status(404).json({ message: '用户不存在' });
        }
        res.status(200).json({ user });
      } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: '获取用户资料失败' });
      }
      break;

    case 'PUT':
      try {
        const { name, avatar } = req.body;
        const result = await userService.updateProfile(decoded.userId, { name, avatar });
        
        if (!result.success) {
          return res.status(400).json({ message: result.message });
        }

        res.status(200).json({
          message: '更新成功',
          user: result.user
        });
      } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: '更新用户资料失败' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
} 