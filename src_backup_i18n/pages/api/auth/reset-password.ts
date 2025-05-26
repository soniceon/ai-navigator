import { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../utils/userService';
import { JwtUtil } from '../../../utils/jwtUtil';
import { validatePassword } from '../../../utils/passwordValidator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: '请提供重置token和新密码' });
    }

    // 验证token
    const decoded = JwtUtil.getInstance().validateToken(token);
    if (!decoded) {
      return res.status(400).json({ message: '无效或已过期的重置链接' });
    }

    // 验证密码强度
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: '密码不符合要求',
        errors: passwordValidation.errors
      });
    }

    const userService = UserService.getInstance();
    const result = await userService.updatePassword(decoded.userId, newPassword);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.status(200).json({
      message: '密码重置成功'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: '处理请求时出错' });
  }
} 