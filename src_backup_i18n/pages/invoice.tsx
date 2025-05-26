import { useTranslation } from 'next-i18next';
import { useState } from 'react';

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

export default function InvoicePage() {
  const { t } = useTranslation('common');
  const [profile, setProfile] = useState(mockProfile);
  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-6 mb-8">
        <div className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{t('profile_invoice_info')}</div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">* Email</label>
            <input className="w-full border rounded px-3 py-2 dark:bg-[#181825] dark:text-white" value={profile.email} readOnly />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">{t('username')}</label>
            <input className="w-full border rounded px-3 py-2 dark:bg-[#181825] dark:text-white" value={profile.username} readOnly />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">{t('company')}</label>
            <input className="w-full border rounded px-3 py-2 dark:bg-[#181825] dark:text-white" value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">{t('country')}</label>
            <input className="w-full border rounded px-3 py-2 dark:bg-[#181825] dark:text-white" value={profile.country} onChange={e => setProfile(p => ({ ...p, country: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">{t('phone')}</label>
            <input className="w-full border rounded px-3 py-2 dark:bg-[#181825] dark:text-white" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">{t('city')}</label>
            <input className="w-full border rounded px-3 py-2 dark:bg-[#181825] dark:text-white" value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">{t('address')}</label>
            <input className="w-full border rounded px-3 py-2 dark:bg-[#181825] dark:text-white" value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">VAT</label>
            <input className="w-full border rounded px-3 py-2 dark:bg-[#181825] dark:text-white" value={profile.vat} onChange={e => setProfile(p => ({ ...p, vat: e.target.value }))} />
          </div>
        </form>
        <div className="flex gap-4 mt-8">
          <button className="px-6 py-2 bg-purple-600 text-white rounded">{t('update_invoice_info')}</button>
          <button className="px-6 py-2 bg-purple-100 text-purple-700 rounded">{t('download_invoice')}</button>
        </div>
      </div>
    </div>
  );
} 