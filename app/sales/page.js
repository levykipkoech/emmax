'use client';
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase';
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import Navbar from '../(components)/Navbar';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useRouter } from 'next/navigation';

const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });
const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

// Function to delete a sale from Firestore
async function deleteSaleFromFirestore(saleId) {
  try {
    await deleteDoc(doc(db, 'sales', saleId)); // Corrected collection reference
    return saleId;
  } catch (err) {
    console.error('Failed to delete sale:', err); // Updated error message
    return null;
  }
}

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Fetch sales data from Firestore
  useEffect(() => {
    async function fetchSales() {
      const salesRef = collection(db, 'sales');
      const salesQuery = query(salesRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(salesQuery);

      const fetchedSales = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSales(fetchedSales);
    }
    fetchSales();
  }, []);

  // Filter sales based on the search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSales(sales);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredSales(
        sales.filter((sale) =>
          sale.productName?.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
  }, [searchQuery, sales]);

  // Handle deleting a sale
  const handleDelete = async (saleId) => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const deletedId = await deleteSaleFromFirestore(saleId);
      if (deletedId) {
        setSales((prev) => prev.filter((sale) => sale.id !== deletedId));
      }
    } catch (error) {
      console.error('Failed to delete sale:', error);
      alert('An error occurred while deleting the sale.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle editing a sale
  const handleEdit = (sale) => {
    router.push(`/salesForm?id=${sale.id}`);
  };

  // Render sales history
  return (
    <div className="p-4">
      <div className="sticky top-0 h-full">
        <Navbar />
      </div>
      <div className="h-screen mt-3">
        <div>
          <h2
            className={
              'text-3xl text-center bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent ' +
              fugaz.className
            }
          >
            Sales History
          </h2>
        </div>
        <div className="flex justify-end items-center">
          <Link href="/salesForm">
            <button className="p-2 m-3 rounded-xl bg-orange-900 hover:bg-gray-900 hover:scale-105 ease-in duration-300 text-white">
              Add Sale
            </button>
          </Link>
          <input
            type="text"
            placeholder="Search by product name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 m-3 border border-gray-300 rounded-lg"
          />
        </div>

        <ul className="text-md text-orange-50 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 rounded-xl">
          {filteredSales.map((sale) => (
            <li
              key={sale.id}
              className="mb-4 rounded-xl shadow-md shadow-gray-900 p-3"
            >
              <div>
                Product:{' '}
                <span className="pl-3 text-blue-300">{sale.productName}</span>
              </div>
              <div>
                Quantity:{' '}
                <span className="pl-3 text-blue-300">{sale.quantity}</span>
              </div>
              <div>
                Total Price:{' '}
                <span className="pl-3 text-blue-300">ksh {sale.totalPrice}</span>
              </div>
              <div>
                Customer:{' '}
                <span className="pl-3 text-blue-300">
                  {sale.customerName || 'N/A'}
                </span>
              </div>
              <div>
                Date:{' '}
                <span className="pl-3 text-blue-300">
                  {sale.timestamp?.toDate().toLocaleString() || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between gap-12 pt-4">
                <button
                  onClick={() => handleDelete(sale.id)}
                  disabled={isDeleting}
                  className={`bg-red-300 hover:bg-red-400 shadow-md shadow-gray-500 rounded-full px-4 py-2 transition ${
                    isDeleting
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105 ease-in duration-100'
                  }`}
                >
                  <MdDelete />
                </button>

                <button
                  onClick={() => handleEdit(sale)}
                  className="bg-orange-300 hover:bg-orange-400 shadow-md shadow-gray-500 rounded-full text-xl px-4 py-2 transition hover:scale-105 ease-in duration-100"
                >
                  <MdModeEdit />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {filteredSales.length === 0 && (
          <p className="text-center text-gray-500">No sales match your search query.</p>
        )}
      </div>
    </div>
  );
}
