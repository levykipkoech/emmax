'use client';
import { Fugaz_One, Quattrocento, Rubik_Wet_Paint } from 'next/font/google';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/firebase';
import {
  collection,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import Product from '../products/page';
import Navbar from '../(components)/Navbar';

const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });
const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

async function addProductToFirestore(
  name,
  buyingPrice,
  sellingPrice,
  quantity
) {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      name: name,
      buyingPrice: buyingPrice,
      sellingPrice: sellingPrice,
      quantity: quantity,
    });
    console.log('product added with id:', docRef.id);
    return true;
  } catch (error) {
    console.error('error adding prodct', error);
    return false;
  }
}
export default function ProductForm() {
  const [name, setName] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  useEffect(() => {
    async function fetchProduct() {
      if (productId) {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const productData = productSnap.data();
          setName(productData.name);
          setBuyingPrice(productData.buyingPrice);
          setSellingPrice(productData.sellingPrice);
          setQuantity(productData.quantity);
          setIsUpdateMode(true);
        } else {
          console.error('Product not found');
        }
      }
    }
    fetchProduct();
  }, [productId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (isUpdateMode && productId) {
        const updatedProduct = {
          name,
          buyingPrice: Number(buyingPrice),
          sellingPrice: Number(sellingPrice),
          quantity: Number(quantity),
          updatedAt: serverTimestamp(),
        };
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, updatedProduct);

        alert('Product updated successfully');
        router.push('/products');
      } else {
        const added = await addProductToFirestore(
          name,
          Number(buyingPrice),
          Number(sellingPrice),
          Number(quantity)
        );
        if (added) {
          alert('Product added successfully');
          setName('');
          setBuyingPrice('');
          setSellingPrice('');
          setQuantity('');
          router.push('/products');
        }
      }
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  const handleUpdateClick = (product) => {
    setName(product.name || '');
    setBuyingPrice(product.buyingPrice || '');
    setSellingPrice(product.sellingPrice || '');
    setQuantity(product.quantity || '');

    setSelectedProduct(product);
    setIsUpdateMode(true);
  };

  return (
    <div className="h-screen">
      <div className="mb-4">
        <Navbar />
      </div>

      <div className="flex justify-center capitalize ">
        <form className="flex-1 flex flex-col justify-center items-center gap-4">
          <h3 className={'text-xl sm:text-3xl ' + fugaz.className}>
            {isUpdateMode ? 'Update Product' : 'Create Product'}
          </h3>
          <label>name: </label>
          <input
            className="w-full max-w-[400px] mx-auto px-4 py-2 duration-300 hover:border-indigo-600 focus:border-indigo-600
    sm:py-3 border-solid border-2 border-indigo-400 rounded-lg outline-none"
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Buying price: </label>
          <input
            className="w-full max-w-[400px] mx-auto px-4 py-2 duration-300 hover:border-indigo-600 focus:border-indigo-600
    sm:py-3 border-solid border-2 border-indigo-400 rounded-lg outline-none"
            id="buyingprice"
            name="buying price"
            type="number"
            required
            value={buyingPrice}
            onChange={(e) => setBuyingPrice(e.target.value)}
          />

          <label>selling price:</label>
          <input
            className="w-full max-w-[400px] mx-auto px-4 py-2 duration-300 hover:border-indigo-600 focus:border-indigo-600
    sm:py-3 border-solid border-2 border-indigo-400 rounded-lg outline-none"
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            required
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
          />

          <label>quantity:</label>
          <input
            className="w-full max-w-[400px] mx-auto px-4 py-2 duration-300 hover:border-indigo-600 focus:border-indigo-600
    sm:py-3 border-solid border-2 border-indigo-400 rounded-lg outline-none"
            id="quantity"
            name="quantity"
            type="number"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button
            type="submit"
            onClick={handleUpdate}
            className="rounded-full bg-orange-600 hover:bg-orange-300 hover:scale-105 ease-in duration-300  m-3 p-2"
          >
            {isUpdateMode ? 'Update product ' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
