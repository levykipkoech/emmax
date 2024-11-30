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
  const [password, SetPassword] = useState('');
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
  async function handlesubmit() {
    if (!email || !password || password.length < 5) {
      setError('Please provide a valid email and a password of at least 5 characters.');
      return;
      
    }
    setAuthenticating(true);
    setError('');
    try {
      if (isRegistered) {
        await signUp(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setAuthenticating(false);
    }
  }
  if (currentUser) {
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
      <div className="flex-1 flex flex-col justify-center items-center gap-4 h-screen p-3 text-xl ">
        <h3 className={' text-5xl md:text-6xl ' + fugaz.className}>
          {isRegistered ? 'Register ' : 'Log in'}
        </h3>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="email"
          aria-label="email"
          className="w-full max-w-[400px] mx-auto px-4 py-2 duration-300 hover:border-gray-600 focus:border-gray-600
    sm:py-3 border-solid border-2 border-gray-400 rounded-lg outline-none"
        />
        <input
          value={password}
          onChange={(e) => {
            SetPassword(e.target.value);
          }}
          placeholder="password"
          type="password"
           aria-label="password"
          className="w-full max-w-[400px] mx-auto px-4 py-2 duration-300 hover:border-gray-600 focus:border-gray-600
     sm:py-3 border-solid border-2 border-gray-400 rounded-lg outline-none"
        />
        <button
          onClick={handlesubmit}
          text={authenticating ? 'Submitting' : 'Submit'}
          className="rounded-full bg-orange-300 hover:bg-orange-600 hover:scale-105 ease-in duration-300 shadow-md shadow-gray-300 mt-3 p-2 max-w-[400px] w-full mx-auto"
        >
          submit
        </button>
        {error && <p className="text-red-500">{error}</p>}

        <div className={'text-lg md:text-2xl ' + fugaz.className}>
          <p>
            {isRegistered
              ? 'Already have an account? '
              : "Don't have an account? "}

            <button
            className='text-orange-600 '
              onClick={() => {
                setIsRegistered(!isRegistered);
              }}
            >
              {isRegistered ? 'Log in  ' : 'Register '}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
