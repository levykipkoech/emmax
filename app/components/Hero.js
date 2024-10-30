import { Rubik_Wet_Paint } from 'next/font/google';
import React from 'react'


const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400']});

export default function Hero() {
  return (
    <div className='flex flex-col flex-1 pt-8 w-full h-screen justify-between place-items-center'>
        <h1 className={'uppercase tracking-widest text-center text-3xl mt-12 sm:text-5xl ' + rubik.className}>
            <span className='p-4 '>E</span>
            <span className='p-4 '>m</span>
            <span className='p-4 '>m</span>
            <span className='p-4 '>a</span>
            <span className='p-4 '>x</span>
        </h1>
    </div>
  )
}
