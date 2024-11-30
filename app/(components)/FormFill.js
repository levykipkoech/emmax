'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/firebase';
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  collection,
} from 'firebase/firestore';
import Navbar from '../(components)/Navbar';
import { Fugaz_One } from 'next/font/google';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function ProductForm() {
  const [name, setName] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams?.get('id'); // Safely get the search parameter

  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          setName(productData.name || '');
          setBuyingPrice(productData.buyingPrice || '');
          setSellingPrice(productData.sellingPrice || '');
          setQuantity(productData.quantity || '');
          setIsUpdateMode(true);
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    }

    fetchProduct();
  }, [productId]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name || !buyingPrice || !sellingPrice || !quantity) {
      alert('Please fill in all fields');
      return;
    }

    const productData = {
      name,
      buyingPrice: Number(buyingPrice),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      if (isUpdateMode && productId) {
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, productData);
        alert('Product updated successfully');
      } else {
        const docRef = await addDoc(collection(db, 'products'), productData);
        console.log('New product added:', docRef.id);
        alert('Product created successfully');
      }

      router.push('/products'); // Redirect to product list
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Try again later.');
    }
  };

  return (
    <div>
      <div className="sticky top-0 mb-4">
        <Navbar />
      </div>

      <div className="flex justify-center h-screen">
        <form
          onSubmit={handleSave}
          className="flex flex-col gap-4 max-w-lg w-full p-4"
        >
          <h3
            className={
              'text-3xl text-center bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent ' +
              fugaz.className
            }
          >
            {isUpdateMode ? 'Update Product' : 'Create Product'}
          </h3>

          <label
            className={'font-semibold text-orange-400 ' + fugaz.className}
            htmlFor="name"
          >
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 rounded-md p-2 w-full"
            required
            aria-label="Product name"
          />

          <label
            className={'font-semibold text-orange-400 ' + fugaz.className}
            htmlFor="buyingPrice"
          >
            Buying Price:
          </label>
          <input
            id="buyingPrice"
            type="number"
            value={buyingPrice}
            onChange={(e) => setBuyingPrice(e.target.value)}
            className="border-2 rounded-md p-2 w-full"
            required
            aria-label="Buying price"
          />

          <label
            className={'font-semibold text-orange-400 ' + fugaz.className}
            htmlFor="sellingPrice"
          >
            Selling Price:
          </label>
          <input
            id="sellingPrice"
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="border-2 rounded-md p-2 w-full"
            required
            aria-label="Selling price"
          />

          <label
            className={'font-semibold text-orange-400 ' + fugaz.className}
            htmlFor="quantity"
          >
            Quantity:
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border-2 rounded-md p-2 w-full"
            required
            aria-label="Quantity"
          />

          <button
            type="submit"
            className={"bg-orange-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-orange-800 " + fugaz.className}
          >
            {isUpdateMode ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
