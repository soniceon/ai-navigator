import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { UserService } from '../../../utils/userService';
import { JwtUtil } from '../../../utils/jwtUtil';

const usersFile = path.resolve(process.cwd(), 'src/data/users.json');

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

  try {
    const userService = UserService.getInstance();
    const user = await userService.findByEmail(email);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.verified) {
      return res.status(400).json({ message: 'Email not verified', token: user.token });
    }

    // 生成JWT token
    const jwtUtil = JwtUtil.getInstance();
    const token = jwtUtil.generateToken(user);
    // 设置cookie
    res.setHeader('Set-Cookie', `token=${token}; Path=/; SameSite=Lax; Max-Age=2592000`);
    return res.status(200).json({ 
      message: 'Login success', 
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 