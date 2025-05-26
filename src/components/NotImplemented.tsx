import { useTranslation } from 'next-i18next';

interface NotImplementedProps {
  title?: string;
  desc?: string;
}

export default function NotImplemented({ title, desc }: NotImplementedProps) {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-12 flex flex-col items-center">
        <div className="text-4xl mb-4 text-purple-400 font-bold">🚧</div>
        <div className="text-2xl text-gray-100 font-bold mb-2">{title || t('not_implemented_title')}</div>
        <div className="text-gray-400">{desc || t('not_implemented_desc')}</div>
      </div>
    </div>
  );
} 