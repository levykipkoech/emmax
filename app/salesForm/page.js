'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { logSale } from '../utils/LogSale';
import Navbar from '../(components)/Navbar';
import { Fugaz_One } from 'next/font/google';
import { useRouter} from 'next/navigation';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });
export default function SalesForm() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const router = useRouter();
  useEffect(() => {
    async function fetchSales() {
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);
      const fetchedProducts = [];
      querySnapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() });
      });
      setProducts(fetchedProducts);
    }
    fetchSales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) {
      alert('Please fill out all required fields');
      return;
    }
    const success = await logSale(
      selectedProduct,
      Number(quantity),
      customerName
    );
    if (success) {
      setSelectedProduct('');
      setQuantity('');
      setCustomerName('');
      router.push('/sales');
    }
    
  };

  return (
    <div className="">
      <div className="sticky top-0">
        <Navbar />
      </div>
      <div className="mt-4 h-screen">
        <h2
          className={
            'text-3xl text-center bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent ' +
            fugaz.className
          }
        >
          Log a Sale
        </h2>
        <div className='flex justify-center'>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col  gap-4 max-w-lg w-full p-4"
          >
            <label >
             <p className={'font-semibold text-orange-400 text-xl ' + fugaz.className}> Product:</p>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="" disabled >
                  Select a product
                </option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.quantity})
                  </option>
                ))}
              </select>
            </label>
            <label className={'font-semibold text-orange-400 ' + fugaz.className}>
              Quantity:
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </label>
            <label className={'font-semibold text-orange-400 ' + fugaz.className}>
              Customer Name (Optional):
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </label>
            <button
              type="submit"
              className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-900"
            >
              Log Sale
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}