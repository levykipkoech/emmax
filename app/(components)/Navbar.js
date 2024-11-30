'use client';
import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import { RiMenu4Fill } from 'react-icons/ri';
import { AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';
import Logout from './Logout';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });
const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });

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
    <div className={'' + fugaz.className}>
      <div
        className={
          shadow
            ? 'sticky w-full h-20 shadow-xl z-[100] bg-gradient-to-r from-gray-700 to-orange-700 '
            : 'sticky w-full h-20 z-[100] '
        }
      >
        <div className="flex justify-between items-center ">
          <Link href="/">
            <h1
              className={
                'bg-gradient-to-r from-orange-500 to-gray-300 bg-clip-text text-transparent uppercase font-bold pl-3 text-3xl text-center' +
                rubik.className
              }
            >
              emmax
            </h1>
          </Link>

          <div className="justify-end">
            <ul className=" hidden md:flex p-2  ">
              <Link href="/">
                <li className="p-2 m-3 rounded-xl  bg-gray-600 hover:scale-105 ease-in duration-300 text-white">
                  home
                </li>
              </Link>
              <Link href="/products">
                <li className="p-2 m-3 rounded-xl  bg-gray-600 hover:scale-105 ease-in duration-300 text-white">
                  products
                </li>
              </Link>
              <Link href="/productform">
                <li className="p-2 m-3 rounded-xl  bg-gray-600  hover:scale-105 ease-in duration-300 text-white">
                  create product
                </li>
              </Link>
              <Link href="/dashboard">
                <li className="p-2 m-3 rounded-xl  bg-gray-600  hover:scale-105 ease-in duration-300 text-white">
                  Dashboard
                </li>
              </Link>

              <Link href="/login">
                <li className="p-2 m-3 rounded-xl bg-gray-600  hover:scale-105 ease-in duration-300 text-white">
                  <Logout />
                </li>
              </Link>
            </ul>
          </div>
          <div
            onClick={handleNav}
            className="md:hidden text-3xl rounded-full hover:cursor-pointer bg-gray-700 text-orange-700 p-1"
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
            <div className="flex items-center justify-between m-2 pb-2 border-b border-[#2F4146]">
              <h1 className={'uppercase font-bold pl-8 ' + fugaz.className}>
                emmax
              </h1>
              <div
                onClick={handleNav}
                className="md:hidden text-3xl rounded-full bg-gray-700 text-orange-700 p-1 hover:cursor-pointer"
              >
                <AiOutlineClose />
              </div>
            </div>

            <ul className="capitalize flex flex-col text-xl">
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
