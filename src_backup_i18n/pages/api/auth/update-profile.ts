import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../utils/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, updates } = req.body;
    if (!userId || !updates) {
      return res.status(400).json({ message: 'Missing userId or updates' });
    }

    const userService = UserService.getInstance();
    const result = await userService.updateProfile(userId, updates);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ 
      message: result.message,
      user: result.user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 