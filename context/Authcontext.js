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
  const [currentUser, setCurrentUser] = useState(null);
  const [userDataOb, setUserDataOb] = useState(null);
  const [loading, setLoading] = useState(true);

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    setUserDataOb(null);
    setCurrentUser(null);
    return signOut(auth);
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // set user to local context state
        setLoading(true);
        setCurrentUser(user);
        if (!user) {
          console.log('no user foud');
          return;
        }
        //if user exists fetch data from firebase datastore
        console.log('fetching user data');
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        let firebaseData = {};
        if (docSnap.exists()) {
          console.log('found user data');
          firebaseData = docSnap.data();
          console.log(firebaseData);
        }
        setUserDataOb(firebaseData);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    userDataOb,
    signUp,
    login,
    logOut,
    setUserDataOb,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
