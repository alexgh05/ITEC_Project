import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/components/product/ProductCard';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product) => set((state) => {
        // Only add if product is not already in wishlist
        if (!state.items.some(item => item.id === product.id)) {
          return { items: [...state.items, product] };
        }
        return state;
      }),
      
      removeItem: (productId: string) => set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      })),
      
      toggleItem: (product: Product) => {
        const exists = get().isInWishlist(product.id);
        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
      
      clearWishlist: () => set({ items: [] }),
      
      isInWishlist: (productId: string) => {
        return get().items.some(item => item.id === productId);
      }
    }),
    {
      name: 'culture-drop-wishlist'
    }
  )
); 