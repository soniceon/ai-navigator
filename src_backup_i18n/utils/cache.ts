const cache = new Map();

export const withCache = (key: string, fn: () => Promise<any>) => {
  if (cache.has(key)) return Promise.resolve(cache.get(key));
  return fn().then(data => {
    cache.set(key, data);
    return data;
  });
}; 