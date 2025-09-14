import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Addon } from '../../types';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  addons: Addon[];
  customization?: string;
}

// Helper function to generate unique cart item ID based on item + addons
const generateCartItemId = (itemId: string, addons: Addon[]): string => {
  const addonIds = addons
    .filter(addon => addon.isAvailable && addon.price > 0)
    .map(addon => addon.name)
    .sort()
    .join(',');
  
  return addonIds ? `${itemId}-${addonIds}` : itemId;
};

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      // Generate unique ID based on item + addons
      const uniqueId = generateCartItemId(action.payload.id, action.payload.addons);
      const existingItem = state.items.find(item => item.id === uniqueId);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        // Create new cart item with unique ID
        const newItem = {
          ...action.payload,
          id: uniqueId,
        };
        state.items.push(newItem);
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    },
    updateCustomization: (state, action: PayloadAction<{ id: string; customization: string }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.customization = action.payload.customization;
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addItem, updateQuantity, updateCustomization, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 