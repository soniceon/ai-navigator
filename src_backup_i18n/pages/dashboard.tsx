import * as React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { nanoid } from 'nanoid';

const mockStats = [
  { label: 'dashboard_tools', value: 2 },
  { label: 'dashboard_ads', value: 1 },
  { label: 'dashboard_credits', value: 10 },
];
const mockTools = [
  { name: 'ChatGPT', url: 'https://chat.openai.com', type: 'type_chat', date: '2024-05-01', status: 'status_online' },
  { name: 'Midjourney', url: 'https://midjourney.com', type: 'type_image', date: '2024-05-02', status: 'status_reviewing' },
];
const mockAds = [
  { tool: 'ChatGPT', url: 'https://chat.openai.com/ad', balance: 100, status: 'status_running' },
  { tool: 'Midjourney', url: 'https://midjourney.com/ad', balance: 0, status: 'status_stopped' },
];
const mockPosts = [
  { title: 'post_ai_tools_recommend', url: 'https://blog.ai.com/post1', type: 'type_post', date: '2024-05-01', status: 'status_published' },
  { title: 'post_external_promotion', url: 'https://blog.ai.com/link1', type: 'type_link', date: '2024-05-02', status: 'status_reviewing' },
];
const mockGpts = [
  { name: 'gpt_writing_assistant', date: '2024-05-01', status: 'status_online' },
  { name: 'gpt_translator', date: '2024-05-02', status: 'status_reviewing' },
];
const mockSites = [
  { site: 'notion.so', status: 'search_completed', total: 10276, unlocked: 0 },
  { site: 'openai.com', status: 'search_completed', total: 11131, unlocked: 0 },
];
const mockFavorites = [
  { name: 'ChatGPT', url: 'https://chat.openai.com', type: 'type_chat', date: '2024-05-01' },
  { name: 'Midjourney', url: 'https://midjourney.com', type: 'type_image', date: '2024-05-02' },
];
const mockProfile = {
  email: 'soniceono@gmail.com',
  username: 'sonice',
  company: '',
  country: '',
  phone: '',
  city: '',
  address: '',
  vat: '',
};

// dicebear 卡通风格列表
const DICEBEAR_STYLES = ['avataaars', 'bottts', 'micah', 'adventurer'] as const;
type DicebearStyle = typeof DICEBEAR_STYLES[number];
type AvatarStyle = DicebearStyle | 'ins';

function randomSeed() {
  return nanoid(10);
}
function getInsAvatarSvg(seed: string) {
  // 渐变色更丰富
  const gradients = [
    ['#f9ce34', '#ee2a7b', '#6228d7'],
    ['#fd5c63', '#fcb045', '#fd1d1d'],
    ['#4f5bd5', '#962fbf', '#d62976'],
    ['#f58529', '#dd2a7b', '#8134af'],
    ['#43cea2', '#185a9d', '#f7971e'],
    ['#00c6ff', '#0072ff', '#f7971e'],
    ['#ff6a00', '#ee0979', '#ff6a00'],
    ['#11998e', '#38ef7d', '#43cea2'],
    ['#fc00ff', '#00dbde', '#43cea2'],
    ['#f7971e', '#ffd200', '#fd1d1d'],
    ['#00c3ff', '#ffff1c', '#ff61a6'],
    ['#43e97b', '#38f9d7', '#fa8bff'],
    ['#fa709a', '#fee140', '#f7971e'],
    ['#30cfd0', '#330867', '#fc466b'],
    ['#f953c6', '#b91d73', '#00f2fe'],
    ['#f857a6', '#ff5858', '#ffc837'],
    ['#00f2fe', '#4facfe', '#43e97b'],
    ['#f7971e', '#ffd200', '#fd1d1d'],
    ['#43cea2', '#185a9d', '#f7971e'],
    ['#fc466b', '#3f5efb', '#43cea2'],
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const idx = Math.abs(hash) % gradients.length;
  const [c1, c2, c3] = gradients[idx];
  // 随机几何/科技元素
  const shapes = [
    `<rect x='18' y='18' width='44' height='44' rx='22' fill='white' fill-opacity='0.10'/>`,
    `<circle cx='40' cy='40' r='16' fill='white' fill-opacity='0.08'/>`,
    `<polygon points='40,20 60,60 20,60' fill='white' fill-opacity='0.08'/>`,
    `<ellipse cx='40' cy='40' rx='24' ry='16' fill='white' fill-opacity='0.07'/>`,
    `<rect x='28' y='28' width='24' height='24' rx='12' fill='white' fill-opacity='0.08'/>`,
    `<polygon points='40,28 52,52 28,52' fill='white' fill-opacity='0.08'/>`,
    `<rect x='22' y='22' width='36' height='36' rx='18' fill='white' fill-opacity='0.07'/>`,
    `<ellipse cx='40' cy='40' rx='18' ry='28' fill='white' fill-opacity='0.06'/>`,
    `<polygon points='40,24 56,56 24,56' fill='white' fill-opacity='0.08'/>`,
    `<path d='M20 40 Q40 10 60 40 Q40 70 20 40' stroke='white' stroke-width='2' fill='none' opacity='0.10'/>`,
    `<path d='M30 30 Q40 10 50 30' stroke='white' stroke-width='2' fill='none' opacity='0.10'/>`,
  ];
  const shape = shapes[Math.abs(hash * 7) % shapes.length];
  // 随机发型
  const hairs = [
    '',
    `<ellipse cx='40' cy='28' rx='16' ry='10' fill='#fff' fill-opacity='0.25'/>`,
    `<rect x='28' y='18' width='24' height='12' rx='6' fill='#fff' fill-opacity='0.18'/>`,
    `<ellipse cx='40' cy='24' rx='14' ry='8' fill='#fff' fill-opacity='0.18'/>`,
    `<path d='M26 32 Q40 10 54 32' stroke='#fff' stroke-width='4' fill='none' opacity='0.18'/>`,
  ];
  const hair = hairs[Math.abs(hash * 11) % hairs.length];
  // 随机配饰
  const accessories = [
    '',
    `<rect x='28' y='48' width='24' height='8' rx='4' fill='#222' fill-opacity='0.18'/>`, // 嘴部口罩
    `<ellipse cx='40' cy='60' rx='10' ry='4' fill='#222' fill-opacity='0.12'/>`, // 下巴阴影
    `<rect x='30' y='34' width='20' height='8' rx='4' fill='#222' fill-opacity='0.10'/>`, // 眼镜
    `<ellipse cx='32' cy='38' rx='5' ry='5' fill='#fff' fill-opacity='0.18' stroke='#222' stroke-width='1.5'/><ellipse cx='48' cy='38' rx='5' ry='5' fill='#fff' fill-opacity='0.18' stroke='#222' stroke-width='1.5'/>`, // 圆眼镜
    `<rect x='28' y='18' width='24' height='8' rx='4' fill='#222' fill-opacity='0.10'/>`, // 帽檐
    `<ellipse cx='40' cy='18' rx='12' ry='4' fill='#222' fill-opacity='0.10'/>`, // 耳机
  ];
  const accessory = accessories[Math.abs(hash * 17) % accessories.length];
  // 随机表情
  const faces = [
    // 微笑
    `<ellipse cx='32' cy='38' rx='3' ry='5' fill='#4f5bd5'/><ellipse cx='48' cy='38' rx='3' ry='5' fill='#4f5bd5'/><ellipse cx='32' cy='38' rx='1.2' ry='2' fill='#fff'/><ellipse cx='48' cy='38' rx='1.2' ry='2' fill='#fff'/><path d='M34 50 Q40 56 46 50' stroke='#fd5c63' stroke-width='2' fill='none'/>`,
    // 酷脸
    `<ellipse cx='32' cy='38' rx='3' ry='5' fill='#00c6ff'/><ellipse cx='48' cy='38' rx='3' ry='5' fill='#00c6ff'/><ellipse cx='32' cy='38' rx='1.2' ry='2' fill='#fff'/><ellipse cx='48' cy='38' rx='1.2' ry='2' fill='#fff'/><rect x='36' y='48' width='8' height='2' rx='1' fill='#222'/>`,
    // 吐舌头
    `<ellipse cx='32' cy='38' rx='3' ry='5' fill='#ee2a7b'/><ellipse cx='48' cy='38' rx='3' ry='5' fill='#ee2a7b'/><ellipse cx='32' cy='38' rx='1.2' ry='2' fill='#fff'/><ellipse cx='48' cy='38' rx='1.2' ry='2' fill='#fff'/><ellipse cx='40' cy='52' rx='4' ry='2' fill='#fd5c63'/><rect x='38' y='50' width='4' height='6' rx='2' fill='#fd5c63'/>`,
    // wink
    `<ellipse cx='32' cy='38' rx='3' ry='5' fill='#43cea2'/><ellipse cx='48' cy='38' rx='3' ry='2' fill='#43cea2'/><ellipse cx='32' cy='38' rx='1.2' ry='2' fill='#fff'/><rect x='46' y='38' width='4' height='1.5' rx='0.75' fill='#fff'/><ellipse cx='40' cy='50' rx='7' ry='3' fill='#f9ce34'/>`,
    // 大笑
    `<ellipse cx='32' cy='38' rx='3' ry='5' fill='#fd5c63'/><ellipse cx='48' cy='38' rx='3' ry='5' fill='#fd5c63'/><ellipse cx='32' cy='38' rx='1.2' ry='2' fill='#fff'/><ellipse cx='48' cy='38' rx='1.2' ry='2' fill='#fff'/><ellipse cx='40' cy='52' rx='8' ry='4' fill='#f9ce34'/><ellipse cx='40' cy='54' rx='4' ry='1.5' fill='#fd1d1d'/>`,
    // 酷笑
    `<ellipse cx='32' cy='38' rx='3' ry='5' fill='#ff6a00'/><ellipse cx='48' cy='38' rx='3' ry='5' fill='#ff6a00'/><ellipse cx='32' cy='38' rx='1.2' ry='2' fill='#fff'/><ellipse cx='48' cy='38' rx='1.2' ry='2' fill='#fff'/><path d='M34 50 Q40 54 46 50' stroke='#43cea2' stroke-width='2' fill='none'/>`,
  ];
  const face = faces[Math.abs(hash * 13) % faces.length];
  // SVG
  const svg = `<svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='g' x1='0' y1='0' x2='80' y2='80' gradientUnits='userSpaceOnUse'><stop stop-color='${c1}'/><stop offset='0.5' stop-color='${c2}'/><stop offset='1' stop-color='${c3}'/></linearGradient></defs><circle cx='40' cy='40' r='38' fill='url(%23g)' stroke='white' stroke-width='4'/>${shape}<g>${hair}${accessory}<circle cx='40' cy='40' r='24' fill='white' fill-opacity='0.18'/>${face}</g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getDicebearUrl(seed: string, style: DicebearStyle = 'avataaars') {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

export default function Dashboard() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const [stats] = useState(mockStats);
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('avatarStyle') as AvatarStyle) || 'avataaars';
    }
    return 'avataaars';
  });
  const [avatarSeed, setAvatarSeed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('avatarSeed') || '';
    }
    return '';
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [randomAvatars, setRandomAvatars] = useState<{style: AvatarStyle, seed: string}[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (showAvatarModal) {
      // 生成9个 DiceBear 风格卡通头像
      const arr: {style: AvatarStyle, seed: string}[] = Array.from({ length: 9 }).map(() => {
        const style = DICEBEAR_STYLES[Math.floor(Math.random() * DICEBEAR_STYLES.length)];
        const seed = randomSeed();
        return { style, seed };
      });
      setRandomAvatars(arr);
    }
  }, [showAvatarModal]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    localStorage.clear();
    if (typeof logout === 'function') logout();
    window.location.href = '/login';
  };

  if (!isLoggedIn || !user) return (
    <div className="flex bg-[#181825] min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8 bg-transparent max-w-6xl mx-auto flex items-center justify-center text-gray-400 text-xl">
        {isLoggedIn ? '正在加载用户信息...' : '请先登录'}
      </main>
    </div>
  );

  return (
    <div className="flex bg-[#181825] min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8 bg-transparent max-w-6xl mx-auto">
        {/* 个人信息卡片 */}
        <div className="bg-[#232136] rounded-2xl shadow-xl border border-purple-900 p-6 flex items-center gap-6 mb-8 transition hover:shadow-2xl">
          <img src={avatarStyle !== 'ins' ? getDicebearUrl(avatarSeed || user?.email || user?.nickname || 'user', avatarStyle as DicebearStyle) : getInsAvatarSvg(avatarSeed || user?.email || user?.nickname || 'user')} alt="avatar" className="w-16 h-16 rounded-full bg-gray-200 shadow-lg" />
          <div>
            <div className="text-lg font-bold mb-1 text-gray-100 flex items-center gap-2"><span className="text-purple-400">👤</span>{user?.nickname}</div>
            <div className="text-gray-400 mb-2">{user?.email}</div>
            <button className="px-4 py-1 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg text-sm shadow flex items-center gap-2 transition hover:scale-105" onClick={handleLogout}><span className="material-icons text-base">logout</span>{t('logout')}</button>
            <button className="ml-2 text-xs text-purple-400 hover:underline" onClick={()=>setShowAvatarModal(true)}>更换头像</button>
            <div className="mt-2 text-sm text-gray-400 flex items-center gap-1"><span className="inline-block align-middle">🧾</span>{t('sidebar_orders')}</div>
          </div>
        </div>
        {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-[#232136] rounded-2xl p-6 shadow-xl w-[380px]">
              <div className="font-bold text-lg mb-4 text-center">选择头像</div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {randomAvatars.map((item, idx) => (
                  <button
                    key={item.style + item.seed + idx}
                    className={`flex flex-col items-center p-1 rounded-lg border-2 transition-all ${avatarStyle === item.style && avatarSeed === item.seed ? 'border-purple-500' : 'border-transparent hover:border-gray-300'}`}
                    onClick={() => {
                      setAvatarStyle(item.style);
                      setAvatarSeed(item.seed);
                      localStorage.setItem('avatarStyle', item.style);
                      localStorage.setItem('avatarSeed', item.seed);
                    }}
                  >
                    <img src={getDicebearUrl(item.seed, item.style as DicebearStyle)} alt="avatar" className="w-14 h-14 rounded-full mb-1 bg-white" />
                  </button>
                ))}
              </div>
              <button className="w-full mt-2 py-2 bg-purple-600 text-white rounded" onClick={() => setShowAvatarModal(false)}>完成</button>
            </div>
          </div>
        )}
        {/* 统计卡片区块 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-4 flex flex-col items-center transition hover:shadow-2xl">
              <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-700 text-transparent bg-clip-text mb-1">{s.value}</div>
              <div className="text-xs text-gray-400">{t(s.label)}</div>
            </div>
          ))}
        </div>
        {/* 业务分区卡片区块 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 我的工具 */}
          <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-6 flex flex-col">
            <div className="font-bold text-lg mb-2 text-gray-100 flex items-center justify-between">
              {t('my_tools')}
              <button className="text-xs text-purple-400 hover:underline" onClick={()=>router.push('/dashboard/tools')}>{t('view_more')}</button>
            </div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-300 border-b border-gray-700">
                  <th>{t('tool')}</th><th>{t('website')}</th><th>{t('type')}</th><th>{t('date')}</th><th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {mockTools.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-400 py-4">{t('no_data')}</td></tr>
                ) : (
                  mockTools.slice(0,3).map((row,i)=>(
                    <tr key={i} className="border-t border-gray-700 text-gray-100">
                      <td>{row.name}</td><td><a href={row.url} className="text-purple-400 font-semibold underline" target="_blank" rel="noopener noreferrer">{row.url}</a></td><td>{t(row.type)}</td><td>{row.date}</td><td>{t(row.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* 广告 */}
          <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-6 flex flex-col">
            <div className="font-bold text-lg mb-2 text-gray-100 flex items-center justify-between">
              {t('my_ads')}
              <button className="text-xs text-purple-400 hover:underline" onClick={()=>router.push('/dashboard/ads')}>{t('view_more')}</button>
            </div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-300 border-b border-gray-700">
                  <th>{t('tool')}</th><th>{t('ad_url')}</th><th>{t('ad_balance')}</th><th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {mockAds.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-400 py-4">{t('no_data')}</td></tr>
                ) : (
                  mockAds.slice(0,3).map((row,i)=>(
                    <tr key={i} className="border-t border-gray-700 text-gray-100">
                      <td>{row.tool}</td><td><a href={row.url} className="text-purple-400 font-semibold underline" target="_blank" rel="noopener noreferrer">{row.url}</a></td><td>{row.balance}</td><td>{t(row.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* 文章/外链 */}
          <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-6 flex flex-col">
            <div className="font-bold text-lg mb-2 text-gray-100 flex items-center justify-between">
              {t('my_posts_links')}
              <button className="text-xs text-purple-400 hover:underline" onClick={()=>router.push('/dashboard/posts')}>{t('view_more')}</button>
            </div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-300 border-b border-gray-700">
                  <th>{t('title')}</th><th>{t('url')}</th><th>{t('type')}</th><th>{t('date')}</th><th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {mockPosts.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-400 py-4">{t('no_data')}</td></tr>
                ) : (
                  mockPosts.slice(0,3).map((row,i)=>(
                    <tr key={i} className="border-t border-gray-700 text-gray-100">
                      <td>{t(row.title)}</td><td><a href={row.url} className="text-purple-400 font-semibold underline" target="_blank" rel="noopener noreferrer">{row.url}</a></td><td>{t(row.type)}</td><td>{row.date}</td><td>{t(row.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* 我的GPTs */}
          <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-6 flex flex-col">
            <div className="font-bold text-lg mb-2 text-gray-100 flex items-center justify-between">
              {t('my_gpts')}
              <button className="text-xs text-purple-400 hover:underline" onClick={()=>router.push('/dashboard/gpts')}>{t('view_more')}</button>
            </div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-300 border-b border-gray-700">
                  <th>{t('gpt_name')}</th><th>{t('date')}</th><th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {mockGpts.length === 0 ? (
                  <tr><td colSpan={3} className="text-center text-gray-400 py-4">{t('no_data')}</td></tr>
                ) : (
                  mockGpts.slice(0,3).map((row,i)=>(
                    <tr key={i} className="border-t border-gray-700 text-gray-100">
                      <td>{t(row.name)}</td><td>{row.date}</td><td>{t(row.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* 社交媒体聆听 */}
          <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-6 flex flex-col">
            <div className="font-bold text-lg mb-2 text-gray-100 flex items-center justify-between">
              {t('listening_sites')}
              <button className="text-xs text-purple-400 hover:underline" onClick={()=>router.push('/dashboard/listening')}>{t('view_more')}</button>
            </div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-300 border-b border-gray-700">
                  <th>{t('site')}</th><th>{t('search_status')}</th><th>{t('total_data')}</th><th>{t('unlocked')}</th>
                </tr>
              </thead>
              <tbody>
                {mockSites.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-400 py-4">{t('no_data')}</td></tr>
                ) : (
                  mockSites.slice(0,3).map((row,i)=>(
                    <tr key={i} className="border-t border-gray-700 text-gray-100">
                      <td>{row.site}</td><td>{t(row.status)}</td><td>{row.total}</td><td>{row.unlocked}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* 收藏 */}
          <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-6 flex flex-col">
            <div className="font-bold text-lg mb-2 text-gray-100 flex items-center justify-between">
              {t('my_favorites')}
              <button className="text-xs text-purple-400 hover:underline" onClick={()=>router.push('/dashboard/favorites')}>{t('view_more')}</button>
            </div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-300 border-b border-gray-700">
                  <th>{t('tool')}</th><th>{t('website')}</th><th>{t('type')}</th><th>{t('date')}</th>
                </tr>
              </thead>
              <tbody>
                {mockFavorites.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-400 py-4">{t('no_data')}</td></tr>
                ) : (
                  mockFavorites.slice(0,3).map((row,i)=>(
                    <tr key={i} className="border-t border-gray-700 text-gray-100">
                      <td>{row.name}</td><td><a href={row.url} className="text-purple-400 font-semibold underline" target="_blank" rel="noopener noreferrer">{row.url}</a></td><td>{t(row.type)}</td><td>{row.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}; 