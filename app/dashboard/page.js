import React from 'react';
import Navbar from '../(components)/Navbar';
//import Product from '../(components)/Product';

export default function dashboardPage() {
  return (
    <div>
      <div className='sticky top-2 h-10'>
        <Navbar />
      </div>
      <div className="h-screen ">
        <h1 className='capitalize tracking-widest font-extrabold text-center text-4xl text-orange-400'>welcome to the dashboard</h1>
      </div>
    </div>
  );
}
