import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export default function TestPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const translationKeys = [
    'featured_ai_tools',
    'no_featured_tools'
  ];
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Translation Test</h1>
      <div className="mb-4">
        <div>Current locale: <strong>{router.locale}</strong></div>
      </div>
      
      <h2 className="text-xl font-bold mt-6 mb-2">Translation Keys:</h2>
      <ul className="space-y-2 border p-4 rounded">
        {translationKeys.map(key => (
          <li key={key} className="border-b pb-2">
            <div className="font-mono text-sm text-gray-600">{key}</div>
            <div className="font-bold">"{t(key)}"</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 