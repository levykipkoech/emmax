'use client';

import { auth, db } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useEffect, useRef } from 'react';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Store the user object
  const [userDataOb, setUserDataOb] = useState(null); // Store the additional user data (from Firestore)
  const [loading, setLoading] = useState(true); // Loading state
  const sessionTimeout = 300000; // 1 hour in milliseconds
  const sessionTimer = useRef(null); // Use useRef to manage sessionTimer reference
  const router = useRouter(); 
  // Function to handle user sign-up
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Function to handle user login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Function to handle user logout
  function logOut() {
    if (sessionTimer.current) clearTimeout(sessionTimer.current);
    setUserDataOb(null);
    setCurrentUser(null);
    return signOut(auth);
  }

  // Handle session expiry
  const handleSessionExpiry = () => {
    alert('Session expired. Please log in again.');
    logOut();
    router.push('/login');
  };

  // Reset session timer
  const resetSessionTimer = () => {
    if (sessionTimer.current) clearTimeout(sessionTimer.current);
    sessionTimer.current = setTimeout(handleSessionExpiry, sessionTimeout);
  };

  // Fetch user data when the authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);

      if (!user) {
        setUserDataOb(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch user data from Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserDataOb(docSnap.data());
          resetSessionTimer(); // Reset the session timer on login
        } else {
          setUserDataOb(null);
        }
      } catch (err) {
        console.error('Error fetching user data:', err.message);
      } finally {
        setLoading(false);
      }
    });

    // Clean up on unmount
    return () => {
      unsubscribe();
      if (sessionTimer.current) clearTimeout(sessionTimer.current);
    };
  }, []);

  // Reset session timer on user activity
  useEffect(() => {
    const handleUserActivity = () => {
      if (currentUser) {
        resetSessionTimer();
      }
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [currentUser]);

  // Extract role from the user data object if it exists
  const role = userDataOb?.role || 'user'; // Default to 'user' if role is not found

  const value = {
    currentUser,
    userDataOb,
    role,
    signUp,
    login,
    logOut,
    setUserDataOb,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
