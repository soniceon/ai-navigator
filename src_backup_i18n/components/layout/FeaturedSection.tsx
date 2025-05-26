import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiArrowUpRight } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';

const FeaturedSection: React.FC = () => {
  const { t } = useTranslation('common');
  
  const featuredTools = [
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      rating: 4.9,
      category: 'chatbots'
    },
    {
      id: 'midjourney',
      name: 'MidJourney',
      rating: 4.8,
      category: 'image-generation'
    },
    {
      id: 'github-copilot',
      name: 'GitHub Copilot',
      rating: 4.7,
      category: 'code-assistants'
    }
  ];
  
  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('featured_ai_tools')}</h2>
        <Link
          href="/featured"
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
        >
          {t('view_all')}
          <FiArrowUpRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {featuredTools.map((tool: {
          id: string;
          name: string;
          rating: number;
          category: string;
        }) => (
          <motion.div
            key={tool.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden card border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative h-32 w-full">
              <Image 
                src={`https://images.pexels.com/photos/7567565/pexels-photo-7567565.jpeg?auto=compress&cs=tinysrgb&w=300`}
                alt={tool.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 flex items-center">
                <span className="text-xs font-medium bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
                  {tool.category}
                </span>
              </div>
              <div className="absolute bottom-2 right-3 flex items-center text-white">
                <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{tool.rating}</span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-gray-900 dark:text-white">{tool.name}</h3>
              <div className="mt-3">
                <Link 
                  href={`/tool/${tool.id}`}
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  {t('view_details')}
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-lg p-4 text-white">
        <h3 className="font-bold mb-2">{t('submit_your_tool')}</h3>
        <p className="text-sm mb-3 text-white/90">{t('submit_description')}</p>
        <Link 
          href="/submit"
          className="inline-block text-sm font-medium bg-white text-primary-600 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
        >
          {t('submit_button')}
        </Link>
      </div>
    </div>
  );
};

export default FeaturedSection;