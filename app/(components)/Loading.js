import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <i className="fa-solid fa-spinner text-slate-800 animate-spin text-4xl sm:text-6xl">
        <AiOutlineLoading3Quarters />
      </i>
    </div>
  );
}
