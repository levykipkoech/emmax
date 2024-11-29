'use client';

import { useAuth } from '@/context/Authcontext';
import { Fugaz_One } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function Page() {
  
  const [email, setEmail] = useState('');
  const [password, SetPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const { signUp, login, currentUser } = useAuth();
  const router = useRouter();
  async function handlesubmit() {
    if (!email || !password || password.length < 5) {
      return;
    }
    setAuthenticating(true);
    try {
      if (isRegistered) {
        await signUp(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setAuthenticating(false);
    }
  }
   if(currentUser){
    
   }
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-4 h-screen p-3 ">
      <h3 className={' ' + fugaz.className}>
        {isRegistered ? 'Register ' : 'Log in'}
      </h3>
      <input
       value={email}
       onChange={(e) => {
         setEmail(e.target.value);
       }}
        placeholder="email"
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
        className="w-full max-w-[400px] mx-auto px-4 py-2 duration-300 hover:border-gray-600 focus:border-gray-600
     sm:py-3 border-solid border-2 border-gray-400 rounded-lg outline-none"
      />
      <button onClick={handlesubmit} text={authenticating?'Submitting':"Submit"} className="rounded-full bg-green-200 hover:bg-green-500 hover:scale-105 ease-in duration-300 shadow-md shadow-gray-300 mt-3 p-2 max-w-[400px] w-full mx-auto">
       submit
      </button>

      <div>
        <p>
          {isRegistered ? 'Already have an account? ' : "Don't have an account? "}

          <button
            onClick={() => {
              setIsRegistered(!isRegistered);
            }}
          >
            {isRegistered ? 'Log in  ' : 'Register '}
          </button>
        </p>
      </div>
    </div>
  );
}