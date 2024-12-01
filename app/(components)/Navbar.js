'use client';
import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import { RiMenu4Fill } from 'react-icons/ri';
import { IoMdClose } from "react-icons/io";
import Link from 'next/link';
import Logout from './Logout';


const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });
const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });
export default function Navbar() {
  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);

  useEffect(() => {
    const handleShadow = () => {
      if (window.scrollY > 90) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };
    window.addEventListener('scroll', handleShadow);
  }, []);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className={ shadow
            ? 'sticky top-0 h-20 shadow-xl z-[100] bg-gradient-to-r from-gray-700 to-orange-700 '
            : 'sticky top-0 h-20 z-[100] ' + fugaz.className}>
      
      <div
        className={" " + fugaz.className}
      >
        <div className="flex justify-between items-center pt-4 ">
          <Link href="/">
            <h1
              className={
                'bg-gradient-to-r from-orange-500 to-gray-300 bg-clip-text text-transparent uppercase font-bold pl-3 text-3xl text-center ' +
                rubik.className
              }
            >
              emmax
            </h1>
          </Link>

          <div className="justify-end">
            <ul className=" hidden md:flex p-2  ">
              <Link href="/">
                <li className="p-2 m-3 rounded-xl  bg-orange-900 hover:bg-gray-900 hover:scale-105 ease-in duration-300 text-white">
                  home
                </li>
              </Link>
              <Link href="/products">
                <li className="p-2 m-3 rounded-xl  bg-orange-900 hover:bg-gray-900 hover:scale-105 ease-in duration-300 text-white">
                  products
                </li>
              </Link>
              <Link href="/productform">
                <li className="p-2 m-3 rounded-xl  bg-orange-900 hover:bg-gray-900  hover:scale-105 ease-in duration-300 text-white">
                  create product
                </li>
              </Link>
              <Link href="/dashboard">
                <li className="p-2 m-3 rounded-xl  bg-orange-900 hover:bg-gray-900  hover:scale-105 ease-in duration-300 text-white">
                  Dashboard
                </li>
              </Link>
              <Link href="/sales">
                <li className="p-2 m-3 rounded-xl  bg-orange-900 hover:bg-gray-900  hover:scale-105 ease-in duration-300 text-white">
                  sales
                </li>
              </Link>

              <Link href="/login">
                <li className="p-2 m-3 rounded-xl bg-orange-900 hover:bg-gray-900  hover:scale-105 ease-in duration-300 text-white">
                  <Logout />
                </li>
              </Link>
            </ul>
          </div>
          <div
            onClick={handleNav}
            className="md:hidden text-3xl rounded-full hover:cursor-pointer bg-gray-700 text-orange-700 p-1 mr-3"
          >
            <RiMenu4Fill />
          </div>
        </div>
      </div>
      
      <div
        className={
          nav ? 'md:hidden fixed left-0 top-0 w-full h-screen bg-black/70' : ''
        }
      >
        <div
          className={
            nav
              ? 'fixed left-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-gray-600 text-orange-600 ease-in duration-500'
              : 'fixed left-[-100%] top-0 p-10 ease-in duration-500'
          }
        >
          <div>
            <div className="flex items-center justify-between m-2 pb-2 border-b border-[#ed6d04] rounded-lg">
              <h1 className={'uppercase font-bold pl-8 text-2xl bg-gradient-to-r from-orange-500 to-gray-300 bg-clip-text text-transparent ' + rubik.className}>
                emmax
              </h1>
              <div
                onClick={handleNav}
                className="md:hidden text-3xl rounded-full bg-gray-700 text-orange-700 p-1 hover:cursor-pointer"
              >
                <IoMdClose />
              </div>
            
            </div>

            <ul className={"capitalize flex flex-col text-xl " + fugaz.className}>
            <Link href="/">
                <li onClick={() => setNav(false)} className="p-4 ">
                  home
                </li>
              </Link>
              <Link href="/products">
                <li onClick={() => setNav(false)} className="p-4 ">
                  products
                </li>
              </Link>
              <Link href="/productform">
                <li onClick={() => setNav(false)} className="p-4">
                  Create product
                </li>
              </Link>
              <Link href="/dashboard">
                <li onClick={() => setNav(false)} className="p-4">
                  dashboard
                </li>
              </Link>
              <Link href="/sales">
                <li onClick={() => setNav(false)} className="p-4">
                sales
                </li>
              </Link>
              <Link href="/login">
                <li onClick={() => setNav(false)} className="p-4">
                  <Logout />
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
