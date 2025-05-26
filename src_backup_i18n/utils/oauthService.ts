import { OAuthProfile } from '../types/user';
import { authConfig } from '../config/auth';

export class OAuthService {
  private static instance: OAuthService;

  private constructor() {}

  public static getInstance(): OAuthService {
    if (!OAuthService.instance) {
      OAuthService.instance = new OAuthService();
    }
    return OAuthService.instance;
  }

  public getGoogleAuthUrl(): string {
    const { clientId, callbackURL } = authConfig.google;
    const scope = 'email profile';
    const state = this.generateState();
    
    return `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(callbackURL)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}`;
  }

  public getGithubAuthUrl(): string {
    const { clientId, callbackURL } = authConfig.github;
    const scope = 'user:email';
    const state = this.generateState();
    
    return `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(callbackURL)}&` +
      `scope=${scope}&` +
      `state=${state}`;
  }

  public async getGoogleProfile(code: string): Promise<OAuthProfile> {
    const { clientId, clientSecret, callbackURL } = authConfig.google;
    
    // 获取访问令牌
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackURL,
        grant_type: 'authorization_code'
      })
    });

    const { access_token } = await tokenResponse.json();

    // 获取用户信息
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const profile = await profileResponse.json();

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatar: profile.picture,
      provider: 'google'
    };
  }

  public async getGithubProfile(code: string): Promise<OAuthProfile> {
    const { clientId, clientSecret, callbackURL } = authConfig.github;
    
    // 获取访问令牌
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackURL
      })
    });

    const { access_token } = await tokenResponse.json();

    // 获取用户信息
    const profileResponse = await fetch('https://api.github.com/user', {
      headers: { 
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    const profile = await profileResponse.json();

    // 获取用户邮箱
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: { 
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    const emails = await emailResponse.json();
    const primaryEmail = emails.find((email: any) => email.primary)?.email || emails[0]?.email;

    return {
      id: profile.id.toString(),
      email: primaryEmail,
      name: profile.name,
      avatar: profile.avatar_url,
      provider: 'github'
    };
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }
} 