import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { persist, createJSONStorage } from "zustand/middleware";

import { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeAll: () => void;
}

const clampQuantity = (requested: number, available: number) => {
  if (!Number.isFinite(requested)) return 1;
  return Math.max(1, Math.min(Math.trunc(requested), available));
};

const useCart = create(
  persist<CartStore>((set, get) => ({
  items: [],
  addItem: (data: Product, quantity = 1) => {
    if (data.quantity <= 0) {
      return toast.error('This product is out of stock.');
    }

    const currentItems = get().items;
    const existingItem = currentItems.find((item) => item.product.id === data.id);

    if (existingItem) {
      const nextQuantity = clampQuantity(existingItem.quantity + quantity, data.quantity);

      if (nextQuantity === existingItem.quantity) {
        return toast('No more stock available for this item.');
      }

      set({
        items: currentItems.map((item) =>
          item.product.id === data.id ? { ...item, quantity: nextQuantity } : item,
        ),
      });
      return toast.success('Cart updated.');
    }

    set({ items: [...currentItems, { product: data, quantity: clampQuantity(quantity, data.quantity) }] });
    toast.success('Item added to cart.');
  },
  removeItem: (id: string) => {
    set({ items: [...get().items.filter((item) => item.product.id !== id)] });
    toast.success('Item removed from cart.');
  },
  incrementItem: (id: string) => {
    set({
      items: get().items.map((item) =>
        item.product.id === id
          ? { ...item, quantity: clampQuantity(item.quantity + 1, item.product.quantity) }
          : item,
      ),
    });
  },
  decrementItem: (id: string) => {
    set({
      items: get().items.map((item) =>
        item.product.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    });
  },
  removeAll: () => set({ items: [] }),
}), {
  name: 'cart-storage',
  storage: createJSONStorage(() => localStorage),
  version: 1,
  migrate: (persistedState) => {
    const state = persistedState as { items?: unknown[] } | undefined;
    const items = state?.items ?? [];

    // version 0 persisted bare Product objects with no quantity — normalize
    // any pre-existing localStorage cart into the new { product, quantity }
    // shape so old visitors don't hit a broken hydration.
    const normalizedItems: CartItem[] = items.map((item: any) =>
      item && typeof item === 'object' && 'product' in item && 'quantity' in item
        ? (item as CartItem)
        : { product: item as Product, quantity: 1 },
    );

    return { items: normalizedItems } as CartStore;
  },
}));

export default useCart;
