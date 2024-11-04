import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import React from 'react';

const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });
const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function ProductForm() {
  return (
    <div className='h-screen'>
       <h1
          className={
            'font-bold uppercase text-center text-base md:text-4xl p-2 text-[#48F2FB] ' +
            rubik.className
          }
        >
          emmax
        </h1>
      <div className="flex justify-center capitalize  ">
       
        <form className="flex flex-col gap-3 shadow-md shadow-gray-400 rounded-xl p-4">
          <h3 className={"text-xl sm:text-3xl " + fugaz.className}>create your product</h3>
          <lebel>name</lebel>
          <input className='bg-gray-200 rounded-xl' />
          <lebel>buying price</lebel>
          <input className='bg-gray-200 rounded-xl' />
          <lebel>selling price</lebel>
          <input className='bg-gray-200 rounded-xl' />
          <lebel>quantity</lebel>
          <input  className='bg-gray-200 rounded-xl'/>
         

          <input
          type='submit'
          className='rounded-full bg-green-200 hover:bg-green-500 hover:scale-105 ease-in duration-300 shadow-md shadow-gray-300 mt-3 p-2'
          value='create product'
          />
        </form>
      </div>
    </div>
  );
}
