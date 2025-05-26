import { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../utils/userService';
import { JwtUtil } from '../../../utils/jwtUtil';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 验证用户是否已登录
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: '未登录' });
  }

  const decoded = JwtUtil.getInstance().validateToken(token);
  if (!decoded) {
    return res.status(401).json({ message: '登录已过期' });
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public/uploads/avatars'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    let file: formidable.File | undefined;
    if (Array.isArray(files.avatar)) {
      file = files.avatar[0];
    } else if (files.avatar) {
      file = files.avatar as formidable.File;
    }

    if (!file) {
      return res.status(400).json({ message: '请上传头像文件' });
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype || '')) {
      if (file.filepath) fs.unlinkSync(file.filepath);
      return res.status(400).json({ message: '只支持 JPG、PNG 和 GIF 格式的图片' });
    }

    // 生成文件名
    const fileName = `${decoded.userId}-${Date.now()}${path.extname(file.originalFilename || '')}`;
    const newPath = path.join(process.cwd(), 'public/uploads/avatars', fileName);
    if (file.filepath) fs.renameSync(file.filepath, newPath);

    // 更新用户头像
    const userService = UserService.getInstance();
    const avatarUrl = `/uploads/avatars/${fileName}`;
    const result = await userService.updateProfile(decoded.userId, { avatar: avatarUrl });

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.status(200).json({
      message: '头像上传成功',
      avatarUrl
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: '上传头像失败' });
  }
} 