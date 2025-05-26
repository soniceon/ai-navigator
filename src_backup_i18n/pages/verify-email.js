import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    async function verifyEmail() {
      if (!token) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .update({ 
            verified: true,
            verification_token: null,
            verification_token_expires: null
          })
          .eq('verification_token', token)
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          setStatus('success');
          // 3秒后跳转到登录页
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setStatus('invalid');
        }
      } catch (error) {
        console.error('验证失败:', error);
        setStatus('error');
      }
    }

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            邮箱验证
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {status === 'verifying' && (
            <div className="text-center">
              <p className="text-gray-600">正在验证您的邮箱...</p>
            </div>
          )}
          {status === 'success' && (
            <div className="text-center">
              <p className="text-green-600">邮箱验证成功！3秒后跳转到登录页面...</p>
            </div>
          )}
          {status === 'invalid' && (
            <div className="text-center">
              <p className="text-red-600">验证链接无效或已过期</p>
              <button
                onClick={() => router.push('/login')}
                className="mt-4 text-indigo-600 hover:text-indigo-500"
              >
                返回登录
              </button>
            </div>
          )}
          {status === 'error' && (
            <div className="text-center">
              <p className="text-red-600">验证过程中发生错误</p>
              <button
                onClick={() => router.push('/login')}
                className="mt-4 text-indigo-600 hover:text-indigo-500"
              >
                返回登录
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 