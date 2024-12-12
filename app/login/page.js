'use client';

import { useAuth } from '@/context/Authcontext';
import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });
const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [isRegistered, setIsRegistered] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const { signUp, login, currentUser } = useAuth();
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  async function handleSubmit() {
    if (!email || !password || password.length < 5) {
      setError(
        'Please provide a valid email and a password of at least 5 characters.'
      );
      return;
    }

    setAuthenticating(true);
    setError('');

    try {
      if (isRegistered) {
        // Sign up logic
        await signUp(email, password, role); // Pass the role
      } else {
        // Login logic
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setAuthenticating(false);
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <Link href="/" className="absolute top-6 left-6">
        <h1
          className={`bg-gradient-to-r from-orange-500 to-gray-300 bg-clip-text text-transparent uppercase font-bold py-3 text-3xl ${rubik.className}`}
        >
          emmax
        </h1>
      </Link>
      <div className="flex flex-col justify-center items-center gap-8 w-full max-w-[400px]">
        <h3 className={`text-5xl md:text-6xl ${fugaz.className}`}>
          {isRegistered ? 'Register' : 'Log in'}
        </h3>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-label="email"
          className="w-full px-4 py-2 sm:py-3 border-2 border-solid border-gray-400 rounded-lg outline-none duration-300 hover:border-gray-600 focus:border-gray-600"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          aria-label="password"
          className="w-full px-4 py-2 sm:py-3 border-2 border-solid border-gray-400 rounded-lg outline-none duration-300 hover:border-gray-600 focus:border-gray-600"
        />
        <button
          onClick={handleSubmit}
          disabled={authenticating}
          className="w-full mt-2 p-2 rounded-full bg-orange-300 shadow-md shadow-gray-300 hover:bg-orange-600 hover:scale-105 ease-in duration-300"
        >
          {authenticating ? 'Submitting...' : 'Submit'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        <div className={`text-lg md:text-2xl ${fugaz.className}`}>
          <p>
            {isRegistered
              ? 'Already have an account? '
              : "Don't have an account? "}
            <button
              className="text-orange-600"
              onClick={() => setIsRegistered(!isRegistered)}
            >
              {isRegistered ? 'Log in' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
