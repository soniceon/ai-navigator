import React from 'react';
import Link from 'next/link';
import { FiStar, FiArrowRight } from 'react-icons/fi';

const popularTools = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'Advanced AI chatbot that can understand complex prompts and generate human-like text responses.',
    rating: 4.9,
    category: 'chatbots',
    image: '/images/chatgpt.png'
  },
  {
    id: 'midjourney',
    name: 'MidJourney',
    description: 'AI art generator that creates stunning images from text descriptions with remarkable quality.',
    rating: 4.8,
    category: 'image-generation',
    image: '/images/midjourney.png'
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps with code completion and suggests code completions as you type.',
    rating: 4.7,
    category: 'code-assistants',
    image: '/images/github-copilot.png'
  },
  {
    id: 'dall-e',
    name: 'DALL-E',
    description: 'OpenAI\'s image generation system that creates realistic images and art from text descriptions.',
    rating: 4.6,
    category: 'image-generation',
    image: '/images/dall-e.png'
  },
  {
    id: 'jasper',
    name: 'Jasper',
    description: 'AI content assistant that helps create marketing copy, blog posts, and other written content.',
    rating: 4.5,
    category: 'content-writing',
    image: '/images/jasper.png'
  },
  {
    id: 'runwayml',
    name: 'RunwayML',
    description: 'Creative suite for AI-generated and AI-enhanced video production and editing.',
    rating: 4.4,
    category: 'video-generation',
    image: '/images/runwayml.png'
  }
];

const PopularTools = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Popular AI Tools</h2>
        <Link href="/tools" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
          View all <FiArrowRight />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularTools.map((tool) => (
          <Link key={tool.id} href={`/tool/${tool.id}`}>
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    {/* You can add actual images here */}
                    <span className="text-2xl">{tool.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                    <div className="flex items-center mt-1">
                      <FiStar className="w-4 h-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-400">{tool.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-400 line-clamp-2">{tool.description}</p>
              <div className="mt-4">
                <span className="inline-block px-2 py-1 text-xs font-medium text-gray-400 bg-gray-700 rounded">
                  {tool.category}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularTools;