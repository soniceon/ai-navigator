import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition border border-gray-300 dark:border-gray-700"
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {isDark ? (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-yellow-400">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-12.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 4.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-600">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      )}
    </button>
  );
} 