import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const usersFile = path.resolve(process.cwd(), 'src/data/users.json');

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}
function writeUsers(users: any[]) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });
  const users = readUsers();
  const user = users.find((u: any) => u.email === email);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.password = password;
  writeUsers(users);
  return res.status(200).json({ message: 'Password updated' });
} 