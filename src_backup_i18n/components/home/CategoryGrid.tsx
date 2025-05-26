import React from 'react';
import Link from 'next/link';
import { FiMessageSquare, FiImage, FiCode, FiFileText, FiVideo, FiMusic, FiDatabase } from 'react-icons/fi';

const categories = [
  {
    id: 'chatbots',
    name: 'AI Chatbots',
    icon: <FiMessageSquare className="w-6 h-6" />,
    count: 235,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'image-generation',
    name: 'Image Generation',
    icon: <FiImage className="w-6 h-6" />,
    count: 182,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'code-assistants',
    name: 'Code Assistants',
    icon: <FiCode className="w-6 h-6" />,
    count: 147,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'content-writing',
    name: 'Content Writing',
    icon: <FiFileText className="w-6 h-6" />,
    count: 168,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'video-generation',
    name: 'Video Generation',
    icon: <FiVideo className="w-6 h-6" />,
    count: 93,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'music-generation',
    name: 'Music Generation',
    icon: <FiMusic className="w-6 h-6" />,
    count: 51,
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    icon: <FiDatabase className="w-6 h-6" />,
    count: 79,
    color: 'from-indigo-500 to-indigo-600'
  }
];

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}`}
          className="group relative overflow-hidden rounded-lg bg-gray-800 p-6 hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${category.color}`}>
              {category.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{category.name}</h3>
              <p className="text-sm text-gray-400">{category.count} tools</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;