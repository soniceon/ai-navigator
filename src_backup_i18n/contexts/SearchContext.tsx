import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface SearchContextType {
  keyword: string;
  setKeyword: (keyword: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  keyword: '',
  setKeyword: () => {},
});

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  
  // 监听语言变化，在切换语言时重置搜索关键词
  useEffect(() => {
    // 当语言切换时，清空搜索词
    setKeyword('');
  }, [router.locale]);

  return (
    <SearchContext.Provider value={{ keyword, setKeyword }}>
      {children}
    </SearchContext.Provider>
  );
} 