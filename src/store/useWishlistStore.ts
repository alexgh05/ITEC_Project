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
          // Get current local wishlist items
          const localItems = get().items;
          
          // Get server wishlist items
          const serverWishlistItems = await getUserWishlist(token);
          
          // Transform server items to ensure they have the necessary fields
          const formattedServerItems = serverWishlistItems.map(item => ({
            ...item,
            id: item.id || (item._id ? item._id.toString() : ''),
            images: Array.isArray(item.images) ? item.images : 
                    (item.images ? [item.images] : []),
            price: item.price || 0,
            name: item.name || 'Unnamed Product',
            culture: item.culture || 'Unknown Culture',
            category: item.category || 'Unknown Category',
            description: item.description || '',
          }));
          
          // Get IDs of items from server wishlist
          const serverItemIds = formattedServerItems.map(item => item.id);
          
          // Find local items that aren't in the server wishlist
          const localItemsToSync = localItems.filter(item => !serverItemIds.includes(item.id));
          
          // If there are local items to sync to the server, add them
          const syncPromises = localItemsToSync.map(async (item) => {
            try {
              await addToWishlist(item.id, token);
              console.log(`Synced local item to server: ${item.name} (${item.id})`);
              return item;
            } catch (error) {
              console.error(`Failed to sync item to server: ${item.name} (${item.id})`, error);
              return null;
            }
          });
          
          // Wait for all sync operations to complete
          await Promise.all(syncPromises);
          
          // Merge both lists (server items + any local items that may not have synced)
          const mergedItems = [
            ...formattedServerItems,
            ...localItemsToSync.filter(item => !serverItemIds.includes(item.id))
          ];
          
          // Remove any duplicates by ID
          const uniqueItems = Array.from(
            new Map(mergedItems.map(item => [item.id, item])).values()
          );
          
          // Update store with merged wishlist
          set({ items: uniqueItems });
          console.log('Wishlist synced successfully:', uniqueItems);
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