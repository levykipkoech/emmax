'use client';

import { auth, db } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useState, useEffect } from 'react';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Store the user object
  const [userDataOb, setUserDataOb] = useState(null); // Store the additional user data (from Firestore)
  const [loading, setLoading] = useState(true); // Loading state

  // Function to handle user sign up
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Function to handle user login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Function to handle user logout
  function logOut() {
    setUserDataOb(null);
    setCurrentUser(null);
    return signOut(auth);
  }

  // Fetch user data when the authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        setCurrentUser(user); // Update the currentUser

        if (!user) {
        
          return;
        }

        // If user exists, fetch user data from Firestore
        
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
      
          const firebaseData = docSnap.data();
          
          setUserDataOb(firebaseData); // Update the user data
        } else {
          
          setUserDataOb(null); // Set to null if no data exists
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe; // Cleanup on component unmount
  }, []);

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
