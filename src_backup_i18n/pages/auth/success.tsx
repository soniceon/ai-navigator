import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const AuthSuccess: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // 3秒后自动跳转到首页
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登录成功
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            您已成功登录，3秒后将自动跳转到首页
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center">
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-500"
            >
              立即跳转到首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess; 