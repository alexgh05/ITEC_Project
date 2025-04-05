import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/components/product/ProductCard';

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  discountPercentage?: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, discountPercentage?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getDiscountAmount: () => number;
  getFinalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, discountPercentage?: number) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id);
        
        if (existingItem) {
          // If item already exists in cart, increase quantity
          return {
            items: state.items.map(item => 
              item.id === product.id 
                ? { 
                    ...item, 
                    quantity: item.quantity + 1,
                    ...(discountPercentage !== undefined && { discountPercentage })
                  }
                : item
            )
          };
        } else {
          // Otherwise add new item with quantity 1
          return {
            items: [
              ...state.items, 
              { 
                ...product, 
                quantity: 1, 
                discountPercentage 
              }
            ]
          };
        }
      }),
      
      removeItem: (productId: string) => set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      })),
      
      updateQuantity: (productId: string, quantity: number) => set((state) => ({
        items: state.items.map(item => 
          item.id === productId 
            ? { ...item, quantity: Math.max(1, quantity) } // Ensure quantity is at least 1
            : item
        )
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getDiscountAmount: () => {
        return get().items.reduce((total, item) => {
          const itemDiscount = item.discountPercentage ? (item.price * item.quantity * item.discountPercentage / 100) : 0;
          return total + itemDiscount;
        }, 0);
      },
      
      getFinalPrice: () => {
        const totalPrice = get().getTotalPrice();
        const discountAmount = get().getDiscountAmount();
        return totalPrice - discountAmount;
      }
    }),
    {
      name: 'culture-drop-cart'
    }
  )
); 