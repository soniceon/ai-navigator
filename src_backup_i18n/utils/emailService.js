const nodemailer = require('nodemailer');

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// 发送验证邮件
async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '验证您的邮箱 - AI Tools Hub',
    html: `
      <h1>欢迎加入 AI Tools Hub!</h1>
      <p>请点击下面的链接验证您的邮箱：</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>此链接将在24小时后过期。</p>
      <p>如果您没有注册账号，请忽略此邮件。</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('发送验证邮件失败:', error);
    return false;
  }
}

module.exports = {
  sendVerificationEmail
}; 