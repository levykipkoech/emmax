'use client';
import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import React, { useState } from 'react';
import { RiMenu4Fill } from 'react-icons/ri';
import { AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });
const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });

export default function Navbar() {
  const [nav, setNav] = useState();

  const handleNav = () => {
    setNav(!nav);
  };
  return (
    <div className={'capitalize font-bold pl-3 sticky z-50 top-0 ' + fugaz.className}>
      <div className="flex justify-between items-center w-full h-full px-2">
       <Link href="/">
       <h1
          className={
            'bg-gradient-to-r from-orange-500 to-gray-300 bg-clip-text text-transparent uppercase font-bold pl-3 text-3xl md:text-center ' +
            rubik.className
          }
        >
          emmax
        </h1>
       </Link>
        

        <div className="justify-end">
          <ul className=" hidden md:flex p-2  ">
            <Link href="/">
              <li className="p-1 m-2 rounded-lg  bg-gray-600 hover:scale-105 ease-in duration-300 text-white">
                home
              </li>
            </Link>
            <Link href="/products">
              <li className="p-1 m-2 rounded-lg  bg-gray-600 hover:scale-105 ease-in duration-300 text-white">
                products
              </li>
            </Link>
            <Link href="/productform">
              <li className="p-1 m-2 rounded-lg  bg-gray-600  hover:scale-105 ease-in duration-300 text-white">
                create product
              </li>
            </Link>
            <Link href="/dashboard">
              <li className="p-1 m-2 rounded-lg  bg-gray-600  hover:scale-105 ease-in duration-300 text-white">
                Dashboard
              </li>
            </Link>
            <Link href="/login">
              <li className="p-1 m-2 rounded-lg  bg-gray-600  hover:scale-105 ease-in duration-300 text-white">
                sign up
              </li>
            </Link>
          </ul>
        </div>
        <div
          onClick={handleNav}
          className="md:hidden text-3xl rounded-full bg-[#567C8D] p-1"
        >
          <RiMenu4Fill />
        </div>
      </div>
      <div
        className={nav ? 'md:hidden fixed left-0 top-0 w-full h-screen ' : ''}
      >
        <div
          className={
            nav
              ? 'fixed left-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-[#55666E] text-[#FFFFFF] ease-in duration-500'
              : 'fixed left-[-100%] top-0 p-10 ease-in duration-500'
          }
        >
          <div>
            <div className="flex items-center justify-between m-2 pb-2 border-b border-[#2F4146]">
              <h1 className={'uppercase font-bold pl-8 ' + fugaz.className}>
                emmax
              </h1>
              <div
                onClick={handleNav}
                className="bg-[#567C8D] text-[#F5EFEB] text-2xl rounded-full p-1 m-1"
              >
                <AiOutlineClose />
              </div>
            </div>

            <ul className="capitalize flex flex-col">
              <Link href="/products">
                <li onClick={() => setNav(false)} className="p-4 text-sm">
                  products
                </li>
              </Link>
              <Link href="/productform">
                <li onClick={() => setNav(false)} className="p-4 text-sm">
                  Create product
                </li>
              </Link>
              <Link href="/dashboard">
                <li onClick={() => setNav(false)} className="p-4 text-sm">
                  dashboard
                </li>
              </Link>

              <Link href="/login">
                <li onClick={() => setNav(false)} className="p-4 text-sm">
                  sign up
                </li>
              </Link>
              <Link href="/login">
                <li onClick={() => setNav(false)} className="p-4 text-sm">
                  log in
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
