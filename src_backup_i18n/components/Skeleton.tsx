import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    />
  );
};

export const ToolCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col items-start border border-gray-100 dark:border-gray-800">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mb-4" />
      <Skeleton className="w-3/4 h-6 mb-2" />
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-1/2 h-4" />
    </div>
  );
};

export const ToolGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <ToolCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default Skeleton; 