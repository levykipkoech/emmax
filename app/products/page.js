import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import React from 'react';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });
const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400']});

export default function Product() {
  return (
    <div>
      <h1
        className={
          'font-bold uppercase text-center text-base md:text-4xl p-2 text-[#48F2FB] ' +
          rubik.className
        }
      >
        emmax
      </h1>
      <div className="grid sm:grid-cols-3 md:grid-cols-4">
        <div className="bg-[#FFFFFF] text-[#00171F] shadow-md shadow-gray-400 capitalize rounded-xl p-2 m-2 text-center overflow-hidden ">
          <div className=" border-b-2 rounded-md pt-2 uppercase ">
            <p>bolts</p>
          </div>
          <div className="flex justify-between pt-2 m-3">
            <p>bp:180</p>
            <p>sp:200</p>
          </div>
          <p>quantity: 93</p>
          <p>minStockLevel: 20</p>

          <div className="flex justify-between pt-2">
            <button className="bg-red-100 hover:bg-red-400 shadow-md shadow-gray-500 rounded-full p-1  ">
              delete
            </button>
            <button className="bg-green-100 hover:bg-green-400 rounded-full p-1 shadow-md shadow-gray-500 ">
              update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
