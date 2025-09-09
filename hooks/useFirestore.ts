import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Subscription } from '@/types/subscription';

export const useFirestore = (userId: string) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'subscriptions'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subscriptionData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subscription[];
      setSubscriptions(subscriptionData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addSubscription = async (subscription: Omit<Subscription, 'id'>) => {
    try {
      await addDoc(collection(db, 'subscriptions'), {
        ...subscription,
        userId,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding subscription:', error);
      throw error;
    }
  };

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    try {
      const subscriptionRef = doc(db, 'subscriptions', id);
      await updateDoc(subscriptionRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      const subscriptionRef = doc(db, 'subscriptions', id);
      await deleteDoc(subscriptionRef);
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  };

  return {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    deleteSubscription
  };
}; 