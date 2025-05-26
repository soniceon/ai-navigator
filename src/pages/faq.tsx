import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

const faqs = [
  { q: 'faq_q1', a: 'faq_a1' },
  { q: 'faq_q2', a: 'faq_a2' },
  { q: 'faq_q3', a: 'faq_a3' },
];

export default function FAQPage() {
  const { t } = useTranslation('common');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('faq')}</h1>
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-8 mb-8">
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