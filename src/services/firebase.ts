import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot,
  DocumentData,
  setDoc
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Food, Order, AdminSettings, User } from '../types';

class FirebaseService {
  // Food Collection Methods
  async addFood(food: Omit<Food, 'id'>) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // Validate food data
      if (!food.name || !food.price || !food.category) {
        throw new Error('Missing required food fields');
      }

      const docRef = await addDoc(collection(db, 'foods'), {
        ...food,
        createdAt: serverTimestamp(),
        createdBy: user.email,
        updatedAt: serverTimestamp(),
        updatedBy: user.email,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding food:', error);
      throw new Error(`Failed to add food: ${error}`);
    }
  }

  subscribeToFoods(callback: (foods: Food[]) => void) {
    const q = query(
      collection(db, 'foods'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, 
      (snapshot) => {
        const foods = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Food));
        callback(foods);
      },
      (error) => {
        console.error('Error in foods subscription:', error);
      }
    );
  }

  async updateFood(id: string, food: Partial<Food>) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const foodRef = doc(db, 'foods', id);
      const foodDoc = await getDoc(foodRef);
      
      if (!foodDoc.exists()) {
        throw new Error('Food not found');
      }

      await updateDoc(foodRef, {
        ...food,
        updatedAt: serverTimestamp(),
        updatedBy: user.email,
      });
    } catch (error) {
      console.error('Error updating food:', error);
      throw new Error(`Failed to update food: ${error}`);
    }
  }

  async deleteFood(id: string) {
    try {
      await deleteDoc(doc(db, 'foods', id));
    } catch (error) {
      throw new Error(`Failed to delete food: ${error}`);
    }
  }

  // Order Collection Methods
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // Validate order data
      if (!order.items || order.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      const orderRef = doc(collection(db, 'orders'));
      await setDoc(orderRef, {
        ...order,
        userId: user.uid,
        createdAt: serverTimestamp(),
        status: 'pending',
      });
      return orderRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error(`Failed to create order: ${error}`);
    }
  }

  subscribeToUserOrders(callback: (orders: Order[]) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, 
      (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Order));
        callback(orders);
      },
      (error) => {
        console.error('Error in orders subscription:', error);
      }
    );
  }

  // Admin Settings Methods
  async updateAdminSettings(settings: Partial<AdminSettings>) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const settingsRef = doc(db, 'adminData', 'settings');
      await updateDoc(settingsRef, {
        ...settings,
        updatedAt: serverTimestamp(),
        updatedBy: user.email,
      });
    } catch (error) {
      console.error('Error updating admin settings:', error);
      throw new Error(`Failed to update admin settings: ${error}`);
    }
  }

  subscribeToAdminSettings(callback: (settings: AdminSettings) => void) {
    return onSnapshot(doc(db, 'adminData', 'settings'), 
      (doc) => {
        if (doc.exists()) {
          callback(doc.data() as AdminSettings);
        }
      },
      (error) => {
        console.error('Error in admin settings subscription:', error);
      }
    );
  }

  // User Methods
  async createUserProfile(userId: string, email: string) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          id: userId,
          email,
          name: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          isAdmin: false,
          isMarketing: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error(`Failed to create user profile: ${error}`);
    }
  }

  async getUserProfile(userId: string | undefined) {
    try {
      if (!userId) {
        console.warn('getUserProfile called with undefined userId');
        return null;
      }

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }

      // If user document doesn't exist, create it
      const user = auth.currentUser;
      if (user) {
        await this.createUserProfile(userId, user.email!);
        return {
          id: userId,
          email: user.email!,
          name: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          isAdmin: false,
          isMarketing: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error(`Failed to get user profile: ${error}`);
    }
  }

  async updateUserProfile(userId: string, data: Partial<User>) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error(`Failed to update user profile: ${error}`);
    }
  }

  async getDeliveryFee(city: string): Promise<number> {
    try {
      const settingsDoc = await getDoc(doc(db, 'adminData', 'settings'));
      if (!settingsDoc.exists()) return 3.50; // Default fee

      const settings = settingsDoc.data() as AdminSettings;
      
      if (city.toLowerCase().includes('galway') && settings.isGalway) {
        return settings.galwayFee;
      } else if (settings.isOutsideGalway) {
        return settings.outsideGalwayFee;
      }
      
      return 0; // No delivery available
    } catch (error) {
      throw new Error(`Failed to get delivery fee: ${error}`);
    }
  }

  async updateUserRole(userId: string, isAdmin: boolean) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isAdmin,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw new Error(`Failed to update user role: ${error}`);
    }
  }

  // Get all orders (for admin)
  async getAllOrders() {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw new Error(`Failed to get orders: ${error}`);
    }
  }

  // Get user's orders
  async getUserOrders(userId: string) {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw new Error(`Failed to get user orders: ${error}`);
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error(`Failed to update order status: ${error}`);
    }
  }

  // Get all users (for admin)
  async getAllUsers() {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error(`Failed to get users: ${error}`);
    }
  }

  async updateOrderTrackingNumber(orderId: string, trackingNumber: string) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        trackingNumber: trackingNumber,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating order tracking number:', error);
      throw error;
    }
  }

  async createPaymentIntent(amount: number): Promise<string> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Send raw amount, backend will convert to cents
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }
}

export const firebaseService = new FirebaseService(); 