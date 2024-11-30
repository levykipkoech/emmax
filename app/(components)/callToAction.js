'use client';
import { useAuth } from '@/context/Authcontext';
import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import Link from 'next/link';
import React from 'react';


const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });
const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });

export default function CallToAction() {
  const { currentUser } = useAuth();
  if (currentUser) {
    return (
      <div className="max-w-[600p] mx-auto text-center mt-5">
        <Link href={'/dashboard'}>
          <button className={"m-2 p-2 capitalize bg-orange-500 hover:bg-orange-200 ease-in duration-300 text-white rounded-full text-xl sm:text-2xl " + fugaz.className}>
          go to dashboard
          </button>
        </Link>
      </div>
    );
  }
  return (
    <div className={" text-center mt-3 capitalize " + fugaz.className}>
      <Link href="/login">
        <button className="m-2 p-2 bg-orange-500 hover:bg-orange-200 ease-in duration-300 text-white rounded-full text-xl sm:text-2xl ">
          sign up
        </button>
      </Link>

      <Link href="/login">
        <button className="m-3 p-3 bg-gray-500 hover:bg-gray-200 ease-in duration-300 text-white rounded-full text-xl sm:text-2xl">
          log in
        </button>
      </Link>
    </div>
  );
}
