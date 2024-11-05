import React from 'react';

export default function Page() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-4 h-screen p-3 ">
      <h3>login</h3>
      <input
        placeholder="email"
        className="w-full max-w-[400px] mx-auto px-4 py-2 duration-300 hover:border-gray-600 focus:border-gray-600
    sm:py-3 border-solid border-2 border-gray-400 rounded-lg outline-none"
      />
      <input
        placeholder="password"
        type="password"
        className="w-full max-w-[400px] mx-auto px-4 py-2 duration-300 hover:border-gray-600 focus:border-gray-600
     sm:py-3 border-solid border-2 border-gray-400 rounded-lg outline-none"
      />
      <button className="rounded-full bg-green-200 hover:bg-green-500 hover:scale-105 ease-in duration-300 shadow-md shadow-gray-300 mt-3 p-2 max-w-[400px] w-full mx-auto">
        submit
      </button>

      <div>
        <p>do not have an account sign up</p>
      </div>
    </div>
  );
}
