'use client';
import { useAuth } from '@/context/Authcontext';
import Link from 'next/link';
import React from 'react';

export default function CallToAction() {
  const { currentUser } = useAuth();
  if (currentUser) {
    return (
      <div className="max-w-[600p] mx-auto">
        <Link href={'/dashboard'}>
          <button>dashboard</button>
        </Link>
      </div>
    );
  }
  return (
    <div className=' text-center mt-3 capitalize'>
    <Link href="/login">
    <button className='m-2 p-2 bg-orange-500 hover:bg-orange-200 ease-in duration-300 text-white rounded-full text-xl sm:text-2xl '>sign up</button>
    </Link>
    
    <Link href="/">
    <button className='m-3 p-3 bg-gray-500 hover:bg-gray-200 ease-in duration-300 text-white rounded-full text-xl sm:text-2xl'>log in</button>
    </Link>
  </div>
  );
}
