import { useRouter } from 'next/router';
import { aiTools } from '@/data/aiTools';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const chatgptDetail = {
  launchDate: 'November 2022',
  company: 'OpenAI',
  website: 'https://chat.openai.com',
  users: '100M+',
  responseTime: '<1s',
  features: {
    zh: [
      '自然语言理解',
      '上下文感知对话',
      '多语言支持',
      '可定制的人格和语气',
      '与消息平台集成',
      '从历史交互中学习'
    ],
    en: [
      'Natural language understanding',
      'Context-aware conversations',
      'Multilingual support',
      'Customizable personality and tone',
      'Integration with messaging platforms',
      'Learning from historical interactions'
    ],
    ja: ['自然言語理解', 'コンテキスト認識会話', '多言語対応', 'カスタマイズ可能な人格とトーン', 'メッセージングプラットフォームとの統合', '履歴からの学習'],
    ko: ['자연어 이해', '상황 인식 대화', '다국어 지원', '맞춤형 성격 및 어조', '메시징 플랫폼과 통합', '이력에서 학습'],
    de: ['Verständnis natürlicher Sprache', 'Kontextbewusste Gespräche', 'Mehrsprachige Unterstützung', 'Anpassbare Persönlichkeit und Tonalität', 'Integration mit Messaging-Plattformen', 'Lernen aus historischen Interaktionen'],
    fr: ['Compréhension du langage naturel', 'Conversations contextuelles', 'Support multilingue', 'Personnalité et ton personnalisables', 'Intégration avec les plateformes de messagerie', 'Apprentissage à partir des interactions passées'],
    es: ['Comprensión del lenguaje natural', 'Conversaciones con conciencia de contexto', 'Soporte multilingüe', 'Personalidad y tono personalizables', 'Integración con plataformas de mensajería', 'Aprendizaje de interacciones históricas'],
    ru: ['Понимание естественного языка', 'Контекстно-осознанные беседы', 'Многоязычная поддержка', 'Настраиваемая личность и тон', 'Интеграция с мессенджерами', 'Обучение на основе истории взаимодействий']
  },
  pricing: [
    {
      name: 'Free',
      price: '$0',
      features: {
        zh: ['自然语言理解', '上下文感知对话', '多语言支持'],
        en: ['Natural language understanding', 'Context-aware conversations', 'Multilingual support'],
        ja: ['自然言語理解', 'コンテキスト認識会話', '多言語対応'],
        ko: ['자연어 이해', '상황 인식 대화', '다국어 지원'],
        de: ['Verständnis natürlicher Sprache', 'Kontextbewusste Gespräche', 'Mehrsprachige Unterstützung'],
        fr: ['Compréhension du langage naturel', 'Conversations contextuelles', 'Support multilingue'],
        es: ['Comprensión del lenguaje natural', 'Conversaciones con conciencia de contexto', 'Soporte multilingüe'],
        ru: ['Понимание естественного языка', 'Контекстно-осознанные беседы', 'Многоязычная поддержка']
      },
      cta: 'get_started',
      ctaUrl: 'https://chat.openai.com/'
    },
    {
      name: 'Pro',
      price: '$29',
      features: {
        zh: ['自然语言理解', '上下文感知对话', '多语言支持', '可定制的人格和语气'],
        en: ['Natural language understanding', 'Context-aware conversations', 'Multilingual support', 'Customizable personality and tone'],
        ja: ['自然言語理解', 'コンテキスト認識会話', '多言語対応', 'カスタマイズ可能な人格とトーン'],
        ko: ['자연어 이해', '상황 인식 대화', '다국어 지원', '맞춤형 성격 및 어조'],
        de: ['Verständnis natürlicher Sprache', 'Kontextbewusste Gespräche', 'Mehrsprachige Unterstützung', 'Anpassbare Persönlichkeit und Tonalität'],
        fr: ['Compréhension du langage naturel', 'Conversations contextuelles', 'Support multilingue', 'Personnalité et ton personnalisables'],
        es: ['Comprensión del lenguaje natural', 'Conversaciones con conciencia de contexto', 'Soporte multilingüe', 'Personalidad y tono personalizables'],
        ru: ['Понимание естественного языка', 'Контекстно-осознанные беседы', 'Многоязычная поддержка', 'Настраиваемая личность и тон']
      },
      cta: 'upgrade',
      ctaUrl: 'https://chat.openai.com/pro'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: {
        zh: ['全部功能', '高级支持', '定制集成'],
        en: ['All features', 'Premium support', 'Custom integration'],
        ja: ['全機能', 'プレミアムサポート', 'カスタム統合'],
        ko: ['모든 기능', '프리미엄 지원', '맞춤형 통합'],
        de: ['Alle Funktionen', 'Premium-Support', 'Individuelle Integration'],
        fr: ['Toutes les fonctionnalités', 'Support premium', 'Intégration personnalisée'],
        es: ['Todas las funciones', 'Soporte premium', 'Integración personalizada'],
        ru: ['Все функции', 'Премиум поддержка', 'Индивидуальная интеграция']
      },
      cta: 'contact_sales',
      ctaUrl: 'mailto:sales@openai.com'
    }
  ]
};

export default function ToolDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { t, i18n } = useTranslation('common');
  const tool = aiTools.find(tl => tl.id === id) || aiTools[0];
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewError, setReviewError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const lang = i18n.language;
  const langTyped = lang as keyof typeof chatgptDetail.features;

  // 拉取评论
  useEffect(() => {
    setLoadingReviews(true);
    fetch(`/api/reviews?toolId=${tool.id}`)
      .then(res => res.json())
      .then(data => { setReviews(data); setLoadingReviews(false); })
      .catch(() => setLoadingReviews(false));
  }, [tool.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    const userEmail = localStorage.getItem('userEmail');
    const username = localStorage.getItem('username') || userEmail;
    if (!userEmail) {
      setShowLoginPrompt(true);
      return;
    }
    if (!userRating) {
      setReviewError('请先评分');
      return;
    }
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId: tool.id, userEmail, username, rating: userRating, comment: review })
    });
    const data = await res.json();
    if (!res.ok) {
      setReviewError(data.message || '提交失败');
      return;
    }
    setUserRating(0);
    setReview('');
    // 重新拉取评论
    fetch(`/api/reviews?toolId=${tool.id}`)
      .then(res => res.json())
      .then(data => setReviews(data));
  };

  const handleDeleteReview = async (id: string) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;
    if (!window.confirm('确定要删除这条评论吗？')) return;
    const res = await fetch('/api/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, userEmail })
    });
    if (res.ok) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  return (
    <div className="flex justify-center w-full">
      <main className="max-w-7xl w-full px-4 py-8">
        {/* 顶部卡片 */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-xl bg-purple-200 flex items-center justify-center text-3xl font-bold text-purple-700 overflow-hidden relative">
              <img
                src={`https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(tool.website ?? '')}`}
                alt={tool.name && tool.name[lang] ? tool.name[lang] : ''}
                className="w-12 h-12"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
                {tool.icon || tool.name[lang][0]}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{tool.name[lang]}</div>
              <div className="text-gray-500 dark:text-gray-300 text-sm mt-1">{t('tool_category_chatbot')}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-500">★</span>
                <span className="font-bold">{tool.rating}</span>
                <span className="text-gray-400 text-xs">{tool.users}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center">
            {tool.website ? (
              <Link href={tool.website} target="_blank" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center">{t('visit_website')}</Link>
            ) : (
              <button className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed" disabled>{t('no_official_website')}</button>
            )}
          </div>
        </div>

        {/* 概览和侧栏 */}
        <div className="flex gap-6 mb-8 w-full">
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <div className="font-bold text-lg mb-2">{t('overview')}</div>
            <div className="text-gray-700 dark:text-gray-200 mb-2">{tool.desc[lang]}</div>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 text-sm space-y-1">
              {chatgptDetail.features[langTyped]?.map((f: string, i: number) => <li key={i}>{f}</li>)}
            </ul>
          </div>
          <div className="w-64 flex-shrink-0 flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
              <div className="font-bold mb-2">{t('quick_info')}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">{t('launched')}: {chatgptDetail.launchDate}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">{t('company')}: {chatgptDetail.company}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">{t('website')}: <a href={chatgptDetail.website} className="underline" target="_blank">{chatgptDetail.website}</a></div>
              <div className="text-sm text-gray-500 dark:text-gray-300">{t('users')}: {chatgptDetail.users}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">{t('response_time')}: {chatgptDetail.responseTime}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
              <div className="font-bold mb-2">{t('share')}</div>
              <div className="flex gap-2 flex-wrap">
                {/* Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out ' + (tool.name?.[lang] || 'this AI tool') + ' on SoniceAI!')}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-black text-white rounded"
                >
                  Twitter
                </a>
                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-black text-white rounded"
                >
                  Facebook
                </a>
                {/* 复制链接 */}
                <button
                  className="px-3 py-1 bg-gray-700 text-white rounded"
                  onClick={() => {
                    navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {t('copy_link')}
                </button>
                {copied && <span className="text-green-500 ml-2">{t('copied')}</span>}
                {/* 微信二维码 */}
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded"
                  onClick={() => setShowQR(!showQR)}
                >
                  {t('wechat')}
                </button>
                {showQR && (
                  <div className="absolute z-50 bg-white p-2 rounded shadow">
                    <QRCodeCanvas value={typeof window !== 'undefined' ? window.location.href : ''} size={120} />
                    <div className="text-xs text-center mt-1">微信扫码分享</div>
                  </div>
                )}
                {/* QQ分享 */}
                <a
                  href={`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent('Check out ' + (tool.name?.[lang] || 'this AI tool') + ' on SoniceAI!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  {t('qq')}
                </a>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent('Check out ' + (tool.name?.[lang] || 'this AI tool') + ' on SoniceAI! ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  {t('whatsapp')}
                </a>
                {/* Instagram（引导复制链接） */}
                <button
                  className="px-3 py-1 bg-pink-500 text-white rounded"
                  onClick={() => {
                    navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {t('instagram')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 定价计划 */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-8">
          <div className="font-bold text-lg mb-4">{t('pricing_plans')}</div>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {chatgptDetail.pricing.map((plan, idx) => (
              <div key={idx} className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 flex flex-col items-start border border-gray-200 dark:border-gray-700">
                <div className="font-bold text-lg mb-2">{t('plan_' + plan.name.toLowerCase())}</div>
                <div className="text-purple-700 dark:text-purple-300 font-bold mb-2">{plan.price}{plan.name !== 'Free' && plan.name !== 'Enterprise' ? ' ' + t('per_month') : ''}</div>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {plan.features[langTyped]?.map((f: string, i: number) => <li key={i}>{f}</li>)}
                </ul>
                {plan.ctaUrl ? (
                  <a
                    href={plan.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto px-4 py-2 bg-black text-white rounded"
                  >
                    {t(plan.cta)}
                  </a>
                ) : (
                  <button className="mt-auto px-4 py-2 bg-black text-white rounded" disabled>
                    {t(plan.cta)}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 评分与评论 */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-8">
          <div className="font-bold text-lg mb-4">{t('ratings_reviews')}</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500 text-2xl">★</span>
            <span className="text-xl font-bold">{tool.rating}</span>
            <span className="text-gray-400 text-sm">({tool.users} {t('users')})</span>
          </div>
          <div className="mb-2">{t('rate_this_tool')}</div>
          <div className="flex gap-1 mb-2">
            {[1,2,3,4,5].map(star => (
              <span
                key={star}
                className={`cursor-pointer text-2xl ${userRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => setUserRating(star)}
              >★</span>
            ))}
          </div>
          <textarea
            className="w-full border rounded p-2 mb-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            placeholder={t('share_your_experience_with_this_tool_optional')}
            value={review}
            onChange={e => setReview(e.target.value)}
          />
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">{t('submit_review')}</button>
        </div>

        {/* 评论区展示 */}
        <div className="mt-6">
          {loadingReviews ? <div>{t('loading')}</div> : (
            reviews.length === 0 ? <div className="text-gray-400">{t('no_comments')}</div> :
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-purple-700">{r.username}</span>
                    <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                    <span className="text-xs text-gray-400 ml-auto">{new Date(r.createdAt).toLocaleString()}</span>
                    {r.userEmail === (typeof window !== 'undefined' ? localStorage.getItem('userEmail') : '') && (
                      <button className="ml-2 text-red-500 hover:underline text-xs" onClick={() => handleDeleteReview(r.id)}>{t('delete')}</button>
                    )}
                  </div>
                  <div className="text-gray-800 dark:text-gray-100 text-sm">{r.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 未登录弹窗 */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
              <div className="mb-4">{t('please_login_before_comment')}</div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={() => { setShowLoginPrompt(false); window.location.href = '/login'; }}>{t('go_to_login')}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = aiTools.map(tool => ({ params: { id: tool.id } }));
  const locales = ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'es', 'ru'];
  const localizedPaths = [];
  for (const locale of locales) {
    for (const path of paths) {
      localizedPaths.push({ params: path.params, locale });
    }
  }
  return {
    paths: localizedPaths,
    fallback: false
  };
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 