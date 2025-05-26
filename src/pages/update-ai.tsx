import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

const faqs = [
  { q: 'update_faq_q1', a: 'update_faq_a1' },
  { q: 'update_faq_q2', a: 'update_faq_a2' },
];

export default function UpdateAIPage() {
  const { t } = useTranslation('common');
  const [form, setForm] = useState({ name: '', url: '', desc: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('update_ai_tool')}</h1>
      <form className="space-y-4 bg-white dark:bg-[#232136] rounded-2xl shadow p-8 mb-8" onSubmit={handleSubmit}>
        <input className="w-full p-3 border rounded" placeholder={t('tool_name')} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input className="w-full p-3 border rounded" placeholder={t('tool_url')} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} required />
        <textarea className="w-full p-3 border rounded" placeholder={t('tool_description')} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={3} required />
        <input className="w-full p-3 border rounded" placeholder={t('email')} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded font-bold text-lg hover:bg-purple-700 transition">{t('update')}</button>
        {submitted && <div className="text-green-600 text-center mt-2">{t('update_success')}</div>}
      </form>
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-8 mb-8">
        <h2 className="text-xl font-bold mb-4">{t('faq')}</h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {faqs.map((item, idx) => (
            <div key={idx}>
              <button className="w-full text-left py-3 font-bold flex justify-between items-center" onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}>
                {t(item.q)}
                <span>{faqOpen === idx ? '-' : '+'}</span>
              </button>
              {faqOpen === idx && <div className="py-2 text-gray-700 dark:text-gray-200">{t(item.a)}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common']))
    }
  };
}; 