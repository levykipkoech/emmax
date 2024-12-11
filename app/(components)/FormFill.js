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
import { useAuth } from '@/context/Authcontext';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function ProductForm() {
  const [name, setName] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const { role, currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams?.get('id');

  useEffect(() => {
    if (role === 'admin') {
      setIsAuthorized(true);
    } else {
      alert('Only admins can access this page');
      router.push('/dashboard');
    }
  }, [role, router]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          setName(productData.name || '');
          setBuyingPrice(productData.buyingPrice || '');
          setSellingPrice(productData.sellingPrice || '');
          setQuantity(productData.quantity || '');
          setCategory(productData.category || ''); // Load category
          setIsUpdateMode(true);
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSubmitting || role !== 'admin') return;

    setIsSubmitting(true);

    try {
      if (
        !name.trim() ||
        Number(buyingPrice) <= 0 ||
        Number(sellingPrice) <= 0 ||
        Number(quantity) < 0 ||
        !category.trim() // Validate category
      ) {
        alert('Please fill in all fields correctly.');
        return;
      }

      const productData = {
        name,
        buyingPrice: Number(buyingPrice),
        sellingPrice: Number(sellingPrice),
        quantity: Number(quantity),
        category, // Include category
        updatedAt: serverTimestamp(),
        ...(isUpdateMode ? {} : { createdAt: serverTimestamp() }),
      };

      if (isUpdateMode && productId) {
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, productData);
        alert('Product updated successfully');
      } else {
        await addDoc(collection(db, 'products'), productData);
        alert('Product created successfully');
        setName('');
        setBuyingPrice('');
        setSellingPrice('');
        setQuantity('');
        setCategory(''); // Reset category
      }

      router.push('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized) return null;

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

          <label className="font-semibold text-orange-400" htmlFor="name">
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 rounded-md p-2 w-full"
            required
          />

          <label
            className="font-semibold text-orange-400"
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
          />

          <label
            className="font-semibold text-orange-400"
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
          />

          <label className="font-semibold text-orange-400" htmlFor="quantity">
            Quantity:
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border-2 rounded-md p-2 w-full"
            required
          />

          <label className="font-semibold text-orange-400" htmlFor="category">
            Category:
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-2 rounded-md p-2 w-full"
            required
          />

          <button
            type="submit"
            className="bg-orange-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-orange-800"
          >
            {isUpdateMode ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
