import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import ToolModal from '@/components/ToolModal';

const mockTools = [
  { name: 'tool_chatgpt', url: 'https://chat.openai.com', type: 'type_chat', date: '2024-05-01', status: 'status_online', description: 'OpenAI 的 ChatGPT 聊天机器人' },
  { name: 'tool_midjourney', url: 'https://midjourney.com', type: 'type_image', date: '2024-05-02', status: 'status_reviewing', description: 'AI 图像生成工具' },
];

const typeOptions = [
  { value: 'type_chat', label: 'Chat' },
  { value: 'type_image', label: 'Image' },
  { value: 'type_post', label: 'Post' },
  { value: 'type_link', label: 'Link' },
];
const statusOptions = [
  { value: 'status_online', label: 'Online' },
  { value: 'status_reviewing', label: 'Reviewing' },
  { value: 'status_running', label: 'Running' },
  { value: 'status_stopped', label: 'Stopped' },
];

export default function Tools() {
  const { t } = useTranslation('common');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(mockTools[0]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('navbar_tools')}</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {t('submit_ai_tool')}
          </button>
          <button
            onClick={() => {
              setSelectedTool(mockTools[0]);
              setIsUpdateModalOpen(true);
            }}
            className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
          >
            {t('update_ai_tool')}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('tool_name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('tool_url')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('tool_type')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('tool_status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockTools.map((tool, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {t(tool.name)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                    {tool.url}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {t(tool.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {t(tool.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => {
                      setSelectedTool(tool);
                      setIsUpdateModalOpen(true);
                    }}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {t('edit')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToolModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        mode="submit"
      />

      <ToolModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        mode="update"
        initialData={selectedTool}
      />
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