import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const usersFile = path.resolve(process.cwd(), 'src/data/users.json');

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Missing email' });
  const users = readUsers();
  const user = users.find((u: any) => u.email === email);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.status(200).json({ nickname: user.nickname || '', createdAt: user.createdAt || null });
} 