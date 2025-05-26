import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { nanoid } from 'nanoid';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

const AVATAR_STYLES = ['ins', 'dicebear'] as const;
type AvatarStyle = typeof AVATAR_STYLES[number];

// dicebear 卡通风格列表
const DICEBEAR_STYLES = ['avataaars', 'bottts', 'micah', 'adventurer'] as const;
type DicebearStyle = typeof DICEBEAR_STYLES[number];
type AvatarStyle = DicebearStyle | 'ins';

const sidebarMenu = [
  { icon: '👤', key: 'profile_info' },
  { icon: '⭐', key: 'profile_favorites' },
  { icon: '📝', key: 'profile_reviews' },
  { icon: '🔒', key: 'profile_password' },
  { icon: '🚪', key: 'profile_logout' },
];

// 生成 ins 风格渐变色
function getAvatarColors(email: string) {
  const gradients = [
    ['#f9ce34', '#ee2a7b', '#6228d7'],
    ['#fd5c63', '#fcb045', '#fd1d1d'],
    ['#4f5bd5', '#962fbf', '#d62976'],
    ['#f58529', '#dd2a7b', '#8134af'],
    ['#43cea2', '#185a9d', '#f7971e'],
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  const idx = Math.abs(hash) % gradients.length;
  return gradients[idx];
}
// 扁平色块风格
function getFlatColor(email: string) {
  const colors = ['#7c4dff', '#00bcd4', '#ff9800', '#4caf50', '#e91e63', '#607d8b'];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
// dicebear svg url（支持多风格）
function getDicebearUrl(seed: string, style: DicebearStyle = 'avataaars') {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

// 随机生成头像种子
function randomSeed() {
  return nanoid(10);
}

// 新增 ins 风格头像生成函数
function getInsAvatarSvg(seed: string) {
  // 生成渐变色
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
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const idx = Math.abs(hash) % gradients.length;
  const [c1, c2, c3] = gradients[idx];
  // SVG 头像
  return `data:image/svg+xml;utf8,<svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='g' x1='0' y1='0' x2='80' y2='80' gradientUnits='userSpaceOnUse'><stop stop-color='${c1}'/><stop offset='0.5' stop-color='${c2}'/><stop offset='1' stop-color='${c3}'/></linearGradient></defs><circle cx='40' cy='40' r='38' fill='url(%23g)' stroke='white' stroke-width='4'/><text x='50%' y='54%' text-anchor='middle' font-size='36' font-family='Arial' fill='white' dy='.3em'>${seed[0].toUpperCase()}</text></svg>`;
}

export default function Profile() {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const [user, setUser] = useState<{ email: string; username: string; createdAt?: number } | null>(null);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('profile_info');
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
    const email = localStorage.getItem('userEmail');
    const username = localStorage.getItem('username');
    if (!email) {
      router.replace('/login');
      return;
    }
    fetch('/api/auth/user?email=' + encodeURIComponent(email))
      .then(res => res.json())
      .then(data => {
        setUser({ email, username: username || email, createdAt: data.createdAt });
        setNickname(data.nickname || username || email);
      });
    fetch('/api/reviews?userEmail=' + encodeURIComponent(email))
      .then(res => res.json())
      .then(setReviews);
  }, [router]);

  useEffect(() => {
    if (showAvatarModal) {
      // 生成9个 ins 风格头像
      const arr: {style: AvatarStyle, seed: string}[] = Array.from({ length: 9 }).map((_, i) => {
        const seed = randomSeed();
        return { style: 'ins' as AvatarStyle, seed };
      });
      setRandomAvatars(arr);
    }
  }, [showAvatarModal]);

  const handleNicknameUpdate = async () => {
    setMessage('');
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user?.email, nickname })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(t('profile_nickname_updated'));
      localStorage.setItem('username', nickname);
    } else {
      setMessage(data.message || t('profile_update_failed'));
    }
  };

  const handlePasswordUpdate = async () => {
    setMessage('');
    if (!password) return setMessage(t('profile_enter_new_password'));
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user?.email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(t('profile_password_updated'));
      setPassword('');
    } else {
      setMessage(data.message || t('profile_update_failed'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    router.replace('/login');
  };

  if (!user) return null;
  const avatarChar = (user.username || user.email)[0]?.toUpperCase() || '?';
  const showSeed = avatarSeed || user.email || user.username || 'user';
  let avatarNode = null;
  if (avatarStyle === 'ins') {
    avatarNode = (
      <img
        src={getInsAvatarSvg(showSeed)}
        alt="avatar"
        className="w-16 h-16 rounded-full mb-2 shadow-lg bg-white"
      />
    );
  } else {
    avatarNode = (
      <img
        src={getDicebearUrl(showSeed, avatarStyle as DicebearStyle)}
        alt="avatar"
        className="w-16 h-16 rounded-full mb-2 shadow-lg bg-white"
      />
    );
  }

  return (
    <div className="min-h-[80vh] flex" /* 不设置背景色，继承全站主题 */>
      {/* 侧边栏 */}
      <aside className="w-64 bg-white dark:bg-[#232136] border-r border-gray-200 dark:border-gray-800 flex flex-col py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          {avatarNode}
          <button
            className="text-xs text-purple-500 hover:underline mb-2"
            onClick={() => setShowAvatarModal(true)}
          >
            更换头像
          </button>
          <div className="font-bold text-lg text-purple-700 dark:text-purple-200 text-center break-all">
            {user.username || user.email}
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {sidebarMenu.map(item => (
            <button
              key={item.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition ${activeTab === item.key ? 'bg-purple-100 text-purple-700 dark:bg-[#393552] dark:text-purple-200' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#232136]'}`}
              onClick={() => {
                if (item.key === 'profile_logout') handleLogout();
                else setActiveTab(item.key);
              }}
            >
              <span>{item.icon}</span> {t(item.key)}
            </button>
          ))}
        </nav>
      </aside>
      {/* 主内容区 */}
      <main className="flex-1 flex flex-col items-center py-10 px-8">
        <div className="w-full max-w-3xl">
          {/* 个人信息卡片 */}
          {activeTab === 'profile_info' && (
            <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-8 mb-8 border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-200 flex items-center gap-2"><span>👤</span> {t('profile_info')}</h2>
              <div className="mb-4 text-gray-700 dark:text-gray-200">{t('profile_email')}：{user.email}</div>
              <div className="mb-4 text-gray-700 dark:text-gray-200">{t('profile_register_time')}：{user.createdAt ? new Date(user.createdAt).toLocaleString() : t('profile_unknown')}</div>
              <div className="mb-4 flex items-center gap-2">
                <span>{t('profile_nickname')}：</span>
                <input value={nickname} onChange={e => setNickname(e.target.value)} className="border rounded px-2 py-1 dark:bg-[#181825] dark:text-white" />
                <button className="ml-2 px-3 py-1 bg-purple-600 text-white rounded" onClick={handleNicknameUpdate}>{t('profile_update_nickname')}</button>
              </div>
              {message && <div className="mb-4 text-green-600 dark:text-green-400">{message}</div>}
            </div>
          )}
          {/* 我的收藏卡片（占位） */}
          {activeTab === 'profile_favorites' && (
            <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-8 mb-8 border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-200 flex items-center gap-2"><span>⭐</span> {t('profile_favorites')}</h2>
              <div className="text-gray-500 dark:text-gray-300">{t('profile_no_favorites')}</div>
            </div>
          )}
          {/* 我的评论卡片 */}
          {activeTab === 'profile_reviews' && (
            <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-8 mb-8 border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-200 flex items-center gap-2"><span>📝</span> {t('profile_reviews')}</h2>
              {reviews.length === 0 ? <div className="text-gray-500 dark:text-gray-300">{t('profile_no_reviews')}</div> : (
                <div className="space-y-2">
                  {reviews.map(r => (
                    <div key={r.id} className="bg-gray-50 dark:bg-[#181825] rounded p-3 border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                        <span className="text-xs text-gray-400 ml-auto">{new Date(r.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="text-gray-800 dark:text-gray-100 text-sm">{r.comment}</div>
                      <div className="text-xs text-gray-400 mt-1">{t('profile_tool_id')}: {r.toolId}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* 修改密码卡片 */}
          {activeTab === 'profile_password' && (
            <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-8 mb-8 border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-200 flex items-center gap-2"><span>🔒</span> {t('profile_password')}</h2>
              <div className="mb-4 flex items-center gap-2">
                <span>{t('profile_new_password')}：</span>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border rounded px-2 py-1 dark:bg-[#181825] dark:text-white" />
                <button className="ml-2 px-3 py-1 bg-purple-600 text-white rounded" onClick={handlePasswordUpdate}>{t('profile_update_password')}</button>
              </div>
              {message && <div className="mb-4 text-green-600 dark:text-green-400">{message}</div>}
            </div>
          )}
        </div>
      </main>
      {/* 头像风格选择弹窗 */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#232136] rounded-2xl p-6 shadow-xl w-[380px]">
            <div className="font-bold text-lg mb-4 text-center">{t('choose_avatar')}</div>
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
                  <img src={item.style === 'ins' ? getInsAvatarSvg(item.seed) : getDicebearUrl(item.seed, item.style as DicebearStyle)} alt="avatar" className="w-14 h-14 rounded-full mb-1 bg-white" />
                </button>
              ))}
            </div>
            <button className="w-full mt-2 py-2 bg-purple-600 text-white rounded" onClick={() => setShowAvatarModal(false)}>{t('done')}</button>
          </div>
        </div>
      )}
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