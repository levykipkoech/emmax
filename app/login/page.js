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
      setError('Please provide a valid email and a password of at least 5 characters.');
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
    <div>
      <Link href="/">
        <h1
          className={
            'bg-gradient-to-r from-orange-500 to-gray-300 bg-clip-text text-transparent uppercase font-bold pl-3 text-3xl fixed ' +
            rubik.className
          }
        >
          emmax
        </h1>
      </Link>
      <div className="flex-1 flex flex-col justify-center items-center gap-4 p-3 text-xl">
        <h3 className={'text-5xl md:text-6xl ' + fugaz.className}>
          {isRegistered ? 'Register ' : 'Log in'}
        </h3>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-label="email"
          className="w-full max-w-[400px] mx-auto px-4 py-2 duration-300 hover:border-gray-600 focus:border-gray-600 sm:py-3 border-solid border-2 border-gray-400 rounded-lg outline-none"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          aria-label="password"
          className="w-full max-w-[400px] mx-auto px-4 py-2 duration-300 hover:border-gray-600 focus:border-gray-600 sm:py-3 border-solid border-2 border-gray-400 rounded-lg outline-none"
        />
        {isRegistered && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="role"
            className="w-full max-w-[400px] mx-auto px-4 py-2 duration-300 hover:border-gray-600 focus:border-gray-600 sm:py-3 border-solid border-2 border-gray-400 rounded-lg outline-none"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        )}
        <button
          onClick={handleSubmit}
          disabled={authenticating}
          className="rounded-full bg-orange-300 hover:bg-orange-600 hover:scale-105 ease-in duration-300 shadow-md shadow-gray-300 mt-3 p-2 max-w-[400px] w-full mx-auto"
        >
          {authenticating ? 'Submitting...' : 'Submit'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        <div className={'text-lg md:text-2xl ' + fugaz.className}>
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
