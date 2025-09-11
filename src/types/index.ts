import { Timestamp } from 'firebase/firestore';

// Food Types
export interface Addon {
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface Food {
  id?: string;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  category: string;
  isAvailable: boolean;
  addons: Addon[];
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

// Order Types
export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  subtotal: number;
  discount?: number;
  discountCode?: string | null;
  discountPercentage?: number | null;
  createdAt: Timestamp | Date;
  trackingNumber?: string;
  dpdTrackingNumber?: string;
  labelUrl?: string;
  isCompleted?: boolean;
  city: string;
  deliveryFee: number;
  paymentIntentId?: string;
  refundId?: string;
  refundStatus?: 'pending' | 'succeeded' | 'failed';
}

export interface OrderItem {
  foodId: string;
  name: string;
  quantity: number;
  price: number;
  addons?: Addon[];
  customization?: string;
}

// Admin Settings Types
export interface AdminSettings {
  isGalway: boolean;
  isOutsideGalway: boolean;
  isDiscount: boolean;
  discountCode: string;
  discountPercentage: number;
  isFamilyDiscount: boolean;
  familyDiscountCode: string;
  familyDiscountPercentage: number;
  galwayFee: number;
  outsideGalwayFee: number;
  galwayDeliveryTime: number;
  outsideGalwayDeliveryTime: number;
  deliveryDay: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isAdmin: boolean;
  isMarketing: boolean;
  createdAt: Date;
  updatedAt: Date;
} 