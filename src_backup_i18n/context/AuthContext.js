import { createContext, useEffect, useState, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined 表示未初始化
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 拉取当前用户信息
  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/user/profile', { withCredentials: true });
      setUser(res.data.user);
      setIsLoggedIn(true);
      return res.data.user;
    } catch (e) {
      setUser(null);
      setIsLoggedIn(false);
      return null;
    }
  };

  // 登录后设置token和状态
  const login = async (userObj) => {
    await fetchUser();
  };
  // 登出时清理状态
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    Cookies.remove('token');
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  // 定时轮询token变化，自动同步登录状态
  useEffect(() => {
    const interval = setInterval(() => {
      const token = Cookies.get('token');
      if (token) {
        if (!isLoggedIn) fetchUser();
      } else {
        if (isLoggedIn) {
          setUser(null);
          setIsLoggedIn(false);
        }
      }
    }, 1000); // 每秒检查一次
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  return <AuthContext.Provider value={{ user, isLoggedIn, setUser, login, logout, fetchUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
} 