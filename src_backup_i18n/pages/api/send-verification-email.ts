import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { email, token } = req.body;
  if (!email || !token) {
    return res.status(400).json({ message: 'Missing email or token' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'soniceono@gmail.com',
      pass: 'ajoj tuhq rtrh bybc',
    },
  });

  const verifyUrl = `http://localhost:3000/verify-email?token=${token}`;
  try {
    await transporter.sendMail({
      from: 'soniceono@gmail.com',
      to: email,
      subject: '邮箱验证',
      html: `<p>请点击以下链接完成邮箱验证：</p><a href="${verifyUrl}">${verifyUrl}</a>`
    });
    return res.status(200).json({ message: 'Verification email sent' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send email', error: String(err) });
  }
} 