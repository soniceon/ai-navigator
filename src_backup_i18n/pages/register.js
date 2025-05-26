import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const router = useRouter();
  const { t, ready } = useTranslation('common');
  const { login } = useAuth();
  if (!ready) return null;
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password !== confirm) {
      setMessage(t('passwords_do_not_match'));
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || t('register_failed'));
    } else {
      // 注册成功后自动登录
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (loginRes.ok) {
        await login();
        window.location.href = '/dashboard';
      } else {
        setMessage(t('register_success_but_login_failed'));
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#181c2a]">
      <div className="w-full max-w-md p-8 bg-white dark:bg-[#23283b] rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">{t('register')}</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="email"
            placeholder={t('email')}
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 dark:bg-[#23283b] dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder={t('name')}
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 dark:bg-[#23283b] dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t('password')}
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 dark:bg-[#23283b] dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t('confirm_password')}
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 dark:bg-[#23283b] dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          {message && (
            <div className="text-sm text-red-400 text-center">{message}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition"
          >
            {loading ? t('registering') : t('register')}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            className="text-purple-400 hover:underline text-sm"
            onClick={() => router.push('/login')}
          >
            {t('already_have_account')}
          </button>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 