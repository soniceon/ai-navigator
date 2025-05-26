import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../utils/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Missing token' });
    }

    const userService = UserService.getInstance();
    const result = await userService.verifyEmail(token);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 