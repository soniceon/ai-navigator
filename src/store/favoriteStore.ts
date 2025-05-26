import { create } from 'zustand';

interface FavoriteState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  setFavorites: (ids: string[]) => void;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('favoriteTools') || '[]')
    : [],
  toggleFavorite: (id) => {
    const favs = get().favorites;
    let newFavs;
    if (favs.includes(id)) {
      newFavs = favs.filter(fav => fav !== id);
    } else {
      newFavs = [...favs, id];
    }
    set({ favorites: newFavs });
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteTools', JSON.stringify(newFavs));
    }
  },
  isFavorite: (id) => get().favorites.includes(id),
  setFavorites: (ids) => set({ favorites: ids }),
})); 