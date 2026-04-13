import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

interface AuthContextType {
  user: (User & { role?: string }) | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(User & { role?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch additional user data from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          let role = 'user';
          if (userDoc.exists()) {
            role = userDoc.data().role || 'user';
          } else {
            // Create user doc if it doesn't exist
            // Default admin for specific email
            if (firebaseUser.email === 'zeerocodes@gmail.com') {
              role = 'admin';
            }
            await setDoc(userDocRef, {
              name: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              role: role,
              createdAt: new Date()
            });
          }
          
          setUser({ ...firebaseUser, role });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        // Fallback to basic user info if Firestore fails
        if (firebaseUser) {
          setUser({ ...firebaseUser, role: 'user' });
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const isAdmin = user?.role === 'admin' || user?.email === 'zeerocodes@gmail.com';

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
