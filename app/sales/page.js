'use client';
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';

const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });
const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function SalesHistory() {
  const [sales, setSales] = useState([]);

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

  return (
    <div className="p-4">
      <div className={"sticky top-0 h-20 flex justify-between " + fugaz.className}>
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
        <div className=''>
          <Link href={'/salesForm'}>Add sales</Link>
        </div>
      </div>
      <div className='h-screen'>
      <h2 className="text-2xl font-bold mb-4">Sales History</h2>
      <ul className="text-md text-orange-50">
        {sales.map((sale) => (
          <li key={sale.id} className="mb-4">
            <div>Product: {sale.productName}</div>
            <div>Quantity: {sale.quantity}</div>
            <div>Total Price: ${sale.totalPrice}</div>
            <div>Customer: {sale.customerName || 'N/A'}</div>
            <div>
              Date: {sale.timestamp?.toDate().toLocaleString() || 'Unknown'}
            </div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
