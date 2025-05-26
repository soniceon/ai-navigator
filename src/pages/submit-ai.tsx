import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

export default function SubmitAIPage() {
  const { t } = useTranslation('common');
  const [form, setForm] = useState({ name: '', url: '', desc: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // 顶部Tab栏国际化
  const tabs = [
    { key: 'submit_ai', label: t('submit_ai'), path: '/submit-ai' },
    { key: 'paid_promotion', label: t('paid_promotion'), path: '/advertise' },
    { key: 'guest_post_link_insert', label: t('guest_post_link_insert'), path: '/guest-post' },
    { key: 'update_ai', label: t('update_ai'), path: '/update-ai' },
    { key: 'submit_gpt', label: t('submit_gpt'), path: '/submit-gpt' },
    { key: 'more_services', label: t('more_services'), path: '/business' },
  ];

  // FAQ国际化
  const faqs = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') },
    { q: t('faq_q5'), a: t('faq_a5') },
    { q: t('faq_q6'), a: t('faq_a6') },
  ];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      {/* 顶部Tab */}
      <div className="flex gap-2 mb-8">
        {tabs.map(tab => (
          <a key={tab.key} href={tab.path} className={`px-4 py-2 rounded-t-lg font-bold ${tab.path === '/submit-ai' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{tab.label}</a>
        ))}
      </div>
      {/* 表单区 */}
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-8 mb-8">
        <h1 className="text-2xl font-bold mb-6">{t('submit_new_ai') || '提交新AI工具'}</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input className="w-full p-3 border rounded" placeholder={t('tool') || '工具名称'} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <input className="w-full p-3 border rounded" placeholder={t('website') || '工具网址'} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} required />
          <textarea className="w-full p-3 border rounded" placeholder={t('tool_description') || t('submit_description')} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} required rows={4} />
          <input className="w-full p-3 border rounded" placeholder={t('email') || '邮箱地址'} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded font-bold text-lg hover:bg-purple-700 transition">{t('submit_button') || t('submit') || '送信'}</button>
          {submitted && <div className="text-green-600 text-center mt-2">{t('submit_success') || '提交成功！'}</div>}
        </form>
      </div>
      {/* 价格/示例区 */}
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-8 mb-8">
        <h2 className="text-xl font-bold mb-4">{t('price_and_example') || '价格与示例'}</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="font-bold mb-2">{t('basic_submit') || '基础提交'}</div>
            <div className="mb-2">{t('basic_submit_desc') || '免费收录，人工审核，1-3个工作日。'}</div>
            <div className="font-bold mb-2">{t('premium_submit') || '加速/推广提交'}</div>
            <div className="mb-2">{t('premium_submit_desc') || '￥99/次，24小时内审核，首页推荐，更多曝光。'}</div>
          </div>
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="font-bold mb-2">{t('example') || '例'}</div>
            <div className="text-sm text-gray-700 dark:text-gray-200">{t('example_content') || 'AIツール名：ChatGPT\n公式サイト：https://chat.openai.com\n説明：OpenAIが提供する強力な対話型AI。多言語対応、無料トライアルあり。'}</div>
          </div>
        </div>
      </div>
      {/* FAQ区 */}
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-8 mb-8">
        <h2 className="text-xl font-bold mb-4">{t('faq') || '常见问题'}</h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {faqs.map((item, idx) => (
            <div key={idx}>
              <button className="w-full text-left py-3 font-bold flex justify-between items-center" onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}>
                {item.q}
                <span>{faqOpen === idx ? '-' : '+'}</span>
              </button>
              {faqOpen === idx && <div className="py-2 text-gray-700 dark:text-gray-200">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common']))
    }
  };
} 