import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebase';
import { Food, Order, AdminSettings } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useFoods = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firebaseService.subscribeToFoods(
      (foods) => {
        setFoods(foods);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { foods, loading, error };
};

export const useUserOrders = (isAdmin: boolean = false) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = isAdmin
      ? firebaseService.subscribeToAllOrders((orders) => {
          setOrders(orders);
          setLoading(false);
        })
      : firebaseService.subscribeToUserOrders((orders) => {
          setOrders(orders);
          setLoading(false);
        });

    return () => unsubscribe();
  }, [user, isAdmin]);

  return { orders, loading, error };
};

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firebaseService.subscribeToAdminSettings(
      (settings) => {
        setSettings(settings);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { settings, loading, error };
}; 