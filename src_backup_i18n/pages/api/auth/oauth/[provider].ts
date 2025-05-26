import { NextApiRequest, NextApiResponse } from 'next';
import { OAuthService } from '../../../../utils/oauthService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { provider } = req.query;
    const oauthService = OAuthService.getInstance();

    let authUrl: string;
    if (provider === 'google') {
      authUrl = oauthService.getGoogleAuthUrl();
    } else if (provider === 'github') {
      authUrl = oauthService.getGithubAuthUrl();
    } else {
      return res.status(400).json({ message: 'Invalid provider' });
    }

    res.redirect(authUrl);
  } catch (error) {
    console.error('OAuth login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 