import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

export default function AdvertisePage() {
  const { t } = useTranslation('common');
  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('advertise_title')}</h1>
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-8 mb-8">
        <h2 className="text-xl font-bold mb-4">{t('advertise_intro')}</h2>
        <p className="mb-4">{t('advertise_desc')}</p>
        <ul className="list-disc pl-6 mb-4">
          <li>{t('advertise_benefit1')}</li>
          <li>{t('advertise_benefit2')}</li>
          <li>{t('advertise_benefit3')}</li>
        </ul>
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition">{t('contact_sales')}</button>
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