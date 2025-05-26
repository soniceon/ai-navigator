import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const reviewsFile = path.resolve(process.cwd(), 'src/data/reviews.json');
const usersFile = path.resolve(process.cwd(), 'src/data/users.json');

function readReviews() {
  if (!fs.existsSync(reviewsFile)) return [];
  return JSON.parse(fs.readFileSync(reviewsFile, 'utf-8'));
}
function writeReviews(reviews: any[]) {
  fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
}
function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { toolId, userEmail } = req.query;
    const reviews = readReviews();
    if (toolId) {
      return res.status(200).json(reviews.filter((r: any) => r.toolId === toolId));
    }
    if (userEmail) {
      return res.status(200).json(reviews.filter((r: any) => r.userEmail === userEmail));
    }
    return res.status(400).json({ message: 'Missing toolId or userEmail' });
  }
  if (req.method === 'POST') {
    const { toolId, userEmail, username, rating, comment } = req.body;
    if (!toolId || !userEmail || !rating) return res.status(400).json({ message: 'Missing required fields' });
    const users = readUsers();
    const user = users.find((u: any) => u.email === userEmail);
    if (!user) return res.status(401).json({ message: 'Not logged in' });
    const reviews = readReviews();
    // 限制每个用户每个工具只能评论一次
    if (reviews.find((r: any) => r.toolId === toolId && r.userEmail === userEmail)) {
      return res.status(400).json({ message: 'You have already reviewed this tool' });
    }
    const newReview = {
      id: uuidv4(),
      toolId,
      userEmail,
      username: username || userEmail,
      rating,
      comment: comment || '',
      createdAt: Date.now()
    };
    reviews.push(newReview);
    writeReviews(reviews);
    return res.status(200).json({ message: 'Review submitted' });
  }
  if (req.method === 'DELETE') {
    const { id, userEmail } = req.body;
    if (!id || !userEmail) return res.status(400).json({ message: 'Missing id or userEmail' });
    const reviews = readReviews();
    const idx = reviews.findIndex((r: any) => r.id === id && r.userEmail === userEmail);
    if (idx === -1) return res.status(404).json({ message: 'Review not found or no permission' });
    reviews.splice(idx, 1);
    writeReviews(reviews);
    return res.status(200).json({ message: 'Review deleted' });
  }
  return res.status(405).json({ message: 'Method not allowed' });
} 