import { aiTools } from '@/data/aiTools';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'next-i18next';
const channels = [
  { key: 'official', icon: '🌐' },
  { key: 'plugin', icon: '🧩' },
  { key: 'api', icon: '🔗' },
  { key: 'community', icon: '👥' },
  { key: 'mobile', icon: '📱' },
  { key: 'other', icon: '🔍' },
];
type Tool = typeof aiTools[number];
function getChannelTools(channelKey: string, allTools: Tool[]): Tool[] {
  const total = allTools.length;
  if (channelKey === 'official') return allTools.slice(0, Math.ceil(total/6));
  if (channelKey === 'plugin') return allTools.slice(Math.ceil(total/6), Math.ceil(total/3));
  if (channelKey === 'api') return allTools.slice(Math.ceil(total/3), Math.ceil(total/2));
  if (channelKey === 'community') return allTools.slice(Math.ceil(total/2), Math.ceil(total*2/3));
  if (channelKey === 'mobile') return allTools.slice(Math.ceil(total*2/3), Math.ceil(total*5/6));
  return allTools.slice(Math.ceil(total*5/6));
}
export default function ChannelRanking() {
  const { lang } = useLanguage();
  const { t, i18n } = useTranslation('common');
  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">{t('channel_ranking')}</h1>
      {channels.map(channel => {
        const tools = getChannelTools(channel.key, aiTools);
        if (!tools.length) return null;
        return (
          <div key={channel.key} className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-xl font-semibold">
              <span>{channel.icon}</span>
              <span>{t(`channel_${channel.key}`)}</span>
              <span className="text-xs text-gray-400">({tools.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tools.map((tool: Tool, idx: number) => (
                <div key={tool.id} className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <span>{tool.icon}</span>
                    <span>{tool.name[lang] || tool.name.en}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{tool.desc[lang] || tool.desc.en}</div>
                  <div className="text-xs text-gray-400">⭐ {tool.rating} | 👥 {tool.users}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
} 