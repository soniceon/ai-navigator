import { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../utils/userService';
import { validatePassword } from '../../../utils/passwordValidator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, name, password } = req.body;

    // 验证必填字段
    if (!email || !name || !password) {
      return res.status(400).json({ message: '请填写所有必填字段' });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: '邮箱格式不正确' });
    }

    // 验证密码强度
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: '密码不符合要求',
        errors: passwordValidation.errors
      });
    }

    const userService = UserService.getInstance();
    let user;
    try {
      user = await userService.create({
        email,
        name,
        password
      });
    } catch (e: any) {
      return res.status(400).json({ message: e.message || '注册失败' });
    }

    res.status(201).json({
      message: '注册成功',
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: '注册失败' });
  }
} 