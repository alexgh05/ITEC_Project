import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/components/product/ProductCard';
import { addToWishlist, removeFromWishlist, getUserWishlist } from '@/lib/api';

interface WishlistState {
  items: Product[];
  addItem: (product: Product, token?: string) => Promise<void>;
  removeItem: (productId: string, token?: string) => Promise<void>;
  toggleItem: (product: Product, token?: string) => Promise<void>;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  setItems: (items: Product[]) => void;
  syncWithUser: (token: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: async (product: Product, token?: string) => {
        // Validate product ID first
        if (!product || (!product.id && !product._id)) {
          console.error('Cannot add product to wishlist: Missing product ID', product);
          throw new Error('Product ID is required');
        }
        
        // Ensure product has an id property (use _id as fallback)
        const productToAdd = {
          ...product,
          id: product.id || (product._id ? product._id.toString() : '')
        };
        
        // If authenticated, sync with server
        if (token) {
          try {
            await addToWishlist(productToAdd.id, token);
            // After successful API call, update local state
            set((state) => {
              if (!state.items.some(item => item.id === productToAdd.id)) {
                return { items: [...state.items, productToAdd] };
              }
              return state;
            });
          } catch (error) {
            console.error('Failed to add to wishlist:', error);
            throw error;
          }
        } else {
          // Guest mode - only update local storage
          set((state) => {
            if (!state.items.some(item => item.id === productToAdd.id)) {
              return { items: [...state.items, productToAdd] };
            }
            return state;
          });
        }
      },
      
      removeItem: async (productId: string, token?: string) => {
        // Validate product ID
        if (!productId) {
          console.error('Cannot remove from wishlist: Missing product ID');
          throw new Error('Product ID is required for removal');
        }
        
        // If authenticated, sync with server
        if (token) {
          try {
            await removeFromWishlist(productId, token);
            // After successful API call, update local state
            set((state) => ({
              items: state.items.filter(item => item.id !== productId)
            }));
          } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            throw error;
          }
        } else {
          // Guest mode - only update local storage
          set((state) => ({
            items: state.items.filter(item => item.id !== productId)
          }));
        }
      },
      
      toggleItem: async (product: Product, token?: string) => {
        // Validate product
        if (!product || (!product.id && !product._id)) {
          console.error('Cannot toggle wishlist: Missing product ID', product);
          throw new Error('Valid product with ID is required');
        }
        
        // Ensure we use a valid ID
        const productId = product.id || (product._id ? product._id.toString() : '');
        
        const exists = get().isInWishlist(productId);
        if (exists) {
          await get().removeItem(productId, token);
        } else {
          await get().addItem(product, token);
        }
      },
      
      clearWishlist: () => set({ items: [] }),
      
      isInWishlist: (productId: string) => {
        if (!productId) {
          return false; // Cannot be in wishlist if ID is invalid
        }
        return get().items.some(item => item.id === productId);
      },
      
      setItems: (items: Product[]) => set({ items }),
      
      syncWithUser: async (token: string) => {
        try {
          const wishlistItems = await getUserWishlist(token);
          
          // Transform items to ensure they have the necessary fields
          const formattedItems = wishlistItems.map(item => {
            // Make sure we have both _id and id
            return {
              ...item,
              id: item.id || (item._id ? item._id.toString() : ''),
              // Ensure images is always an array
              images: Array.isArray(item.images) ? item.images : 
                      (item.images ? [item.images] : []),
              // Default values for any missing fields
              price: item.price || 0,
              name: item.name || 'Unnamed Product',
              culture: item.culture || 'Unknown Culture',
              category: item.category || 'Unknown Category',
              description: item.description || '',
            };
          });
          
          set({ items: formattedItems });
          console.log('Wishlist synced successfully:', formattedItems);
        } catch (error) {
          console.error('Failed to sync wishlist with user:', error);
          throw error;
        }
      }
    }),
    {
      name: 'culture-drop-wishlist'
    }
  )
); 