import jwt from 'jsonwebtoken';
import { User } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DEFAULT_EXPIRES_IN = '7d';
const REMEMBER_ME_EXPIRES_IN = '30d';

export class JwtUtil {
  private static instance: JwtUtil;

  private constructor() {}

  public static getInstance(): JwtUtil {
    if (!JwtUtil.instance) {
      JwtUtil.instance = new JwtUtil();
    }
    return JwtUtil.instance;
  }

  public generateToken(user: User, rememberMe?: boolean): string {
    const expiresIn = rememberMe ? REMEMBER_ME_EXPIRES_IN : DEFAULT_EXPIRES_IN;
    
    return jwt.sign(
      { 
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn }
    );
  }

  public validateToken(token: string): { userId: string; email: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch (error) {
      return null;
    }
  }

  public decodeToken(token: string): { userId: string; email: string } | null {
    try {
      return jwt.decode(token) as { userId: string; email: string };
    } catch (error) {
      return null;
    }
  }
} 