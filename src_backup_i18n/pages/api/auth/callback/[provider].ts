import { NextApiRequest, NextApiResponse } from 'next';
import { OAuthService } from '../../../../utils/oauthService';
import { UserService } from '../../../../utils/userService';
import { JwtUtil } from '../../../../utils/jwtUtil';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { provider } = req.query;
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const oauthService = OAuthService.getInstance();
    const userService = UserService.getInstance();
    const jwtUtil = JwtUtil.getInstance();

    let profile;
    if (provider === 'google') {
      profile = await oauthService.getGoogleProfile(code as string);
    } else if (provider === 'github') {
      profile = await oauthService.getGithubProfile(code as string);
    } else {
      return res.status(400).json({ message: 'Invalid provider' });
    }

    // 查找或创建用户
    let user = await userService.findByProviderId(profile.provider, profile.id);
    
    if (!user) {
      // 检查邮箱是否已存在
      const existingUser = await userService.findByEmail(profile.email);
      if (existingUser) {
        // 如果用户存在但没有关联第三方账号，则关联
        user = await userService.linkProvider(existingUser.id, profile);
      } else {
        // 创建新用户
        user = await userService.create({
          email: profile.email,
          name: profile.name,
          provider: profile.provider,
          providerId: profile.id,
          avatar: profile.avatar
        });
      }
    }

    // 生成 JWT token
    const token = jwtUtil.generateToken(user);

    // 设置 cookie
    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);

    // 重定向到前端页面
    res.redirect('/auth/success');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect('/auth/error');
  }
} 