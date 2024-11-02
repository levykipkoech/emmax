import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import React from 'react';

const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });
const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function Hero() {
  return (
    <div>
    <div className="flex flex-col flex-1 pt-8 w-full justify-between place-items-center">
      <h1
        className={
          'uppercase tracking-widest text-center text-3xl text-[#E22227] mt-12 sm:text-5xl ' +
          rubik.className
        }
      >
        <span className="p-4 ">e</span>
        <span className="p-4 ">m</span>
        <span className="p-4 ">m</span>
        <span className="p-4 ">a</span>
        <span className="p-4 ">x</span>
      </h1>
     
      <div className='pt-12 '>
        <p className={'text-xl sm:text-2xl capitalize ' + fugaz.className }>your stock management made easy</p>
      </div>
    </div>
   
    </div>
  );
}
