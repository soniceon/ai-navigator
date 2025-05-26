import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

const Profile: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    avatar: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setProfile(data.user);
      setFormData({
        name: data.user.name,
        avatar: data.user.avatar || ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户资料失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setProfile(data.user);
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新用户资料失败');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setFormData(prev => ({
        ...prev,
        avatar: data.avatarUrl
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传头像失败');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">加载中...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen">未找到用户资料</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative w-24 h-24">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt="头像"
                  layout="fill"
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-gray-500">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">用户名</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">头像</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="mt-1 block w-full"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  取消
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">用户名</h2>
                <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">邮箱</h2>
                <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                编辑资料
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 