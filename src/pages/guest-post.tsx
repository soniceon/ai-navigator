import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function GuestPostPage() {
  const { t } = useTranslation('common');
  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('guest_post_link_insert') || 'Guest Post / Insert Link'}</h1>
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-8 mb-8">
        <p>{t('coming_soon') || 'Coming soon...'}</p>
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