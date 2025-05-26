import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../utils/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Missing token or new password' });
    }

    const userService = UserService.getInstance();
    const result = await userService.updatePassword(token, newPassword);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error('Password update error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 