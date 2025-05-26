import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        ...options
      });
      return true;
    } catch (error) {
      console.error('Send email error:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
    const html = `
      <h1>重置密码</h1>
      <p>请点击下面的链接重置您的密码：</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>此链接将在1小时后过期。</p>
      <p>如果您没有请求重置密码，请忽略此邮件。</p>
    `;

    return this.sendEmail({
      to: email,
      subject: '重置密码',
      html
    });
  }
}

export default EmailService; 