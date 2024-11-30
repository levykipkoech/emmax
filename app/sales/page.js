'use client';
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import Navbar from '../(components)/Navbar';

const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });
const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchSales() {
      const salesRef = collection(db, 'sales');
      const salesQuery = query(salesRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(salesQuery);

      const fetchedSales = [];
      querySnapshot.forEach((doc) => {
        fetchedSales.push({ id: doc.id, ...doc.data() });
      });
      setSales(fetchedSales);
    }
    fetchSales();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSales(sales);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredSales(
        sales.filter((sale) =>
          sale.productName.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
  }, [searchQuery, sales]);

  return (
    <div className="p-4">
      <div className="sticky top-0 h-full">
        <Navbar />
      </div>
      <div className="h-screen mt-3">
        <div className=" ">
          <h2
            className={
              'text-3xl text-center bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent ' +
              fugaz.className
            }
          >
            Sales History
          </h2>
        </div>
        <div className='flex justify-end align-center'>
          <button className=" p-2 m-3 rounded-xl  bg-orange-900 hover:bg-gray-900 hover:scale-105 ease-in duration-300 text-white w-auto ">
            <Link href={'/salesForm'}>add sales</Link>
          </button>
          <input
            type="text"
            placeholder="Search by product name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" p-2 m-3 border border-gray-300 rounded-lg"
          />
        </div>

        <ul className="text-md text-orange-50 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4  text-md rounded-xl">
          {filteredSales.map((sale) => (
            <li
              key={sale.id}
              className="mb-4 rounded-xl shadow-md shadow-gray-900 p-3"
            >
              <div>
                Product:{' '}
                <span className="pl-3 text-blue-300"> {sale.productName}</span>
              </div>
              <div>
                Quantity:{' '}
                <span className="pl-3 text-blue-300"> {sale.quantity}</span>
              </div>
              <div>
                Total Price:{' '}
                <span className="pl-3 text-blue-300">
                  {' '}
                  ksh {sale.totalPrice}
                </span>
              </div>
              <div>
                Customer:{' '}
                <span className="pl-3 text-blue-300">
                  {' '}
                  {sale.customerName || 'N/A'}
                </span>
              </div>
              <div>
                Date:{' '}
                <span className="pl-3 text-blue-300">
                  {' '}
                  {sale.timestamp?.toDate().toLocaleString() || 'Unknown'}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {filteredSales.length === 0 && <p>No sales match your search query.</p>}
      </div>
    </div>
  );
}
