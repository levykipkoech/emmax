'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useState } from 'react';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function Navbar() {
    const [nav, setNav] = useState()

    const handleNav =()=>{
        setNav(!nav)
    }
  return (
    <div className="flex justify-between items-center w-full h-full">
      <div>
        <h1 className={'uppercase font-bold pl-8 ' + fugaz.className}>emmax</h1>
      </div>
      <div className="flex justify-between">
        <ul className="flex p-2 ">
          <li className='p-1 m-2 rounded-lg bg-[#567C8D]'>prodicts</li>
          <li className='p-1 m-2 rounded-lg bg-[#567C8D]'>sales</li>
          <li className='p-1 m-2 rounded-lg bg-[#567C8D]'>Dashboard</li>
          <li className='p-1 m-2 rounded-lg bg-[#567C8D]'>sign up</li>
          <li className='p-1 m-2 rounded-lg bg-[#567C8D]'>log in</li>
        </ul>
      </div>
      <div className='md:hidden'>

      </div>
    </div>
  );
}
