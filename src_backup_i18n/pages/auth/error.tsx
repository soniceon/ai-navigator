import React from 'react';
import Link from 'next/link';

const AuthError: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登录失败
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            抱歉，登录过程中出现错误。请稍后重试。
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/auth/login"
              className="text-indigo-600 hover:text-indigo-500"
            >
              返回登录页面
            </Link>
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-500"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthError; 