interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  // 只检查密码长度
  if (password.length < 6) {
    errors.push('密码长度至少为6个字符');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
} 