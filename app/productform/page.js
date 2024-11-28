'use client';
import { Fugaz_One, Quattrocento, Rubik_Wet_Paint } from 'next/font/google';
import React, { useState, useEffect } from 'react';
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
  const [buyingPrice, setBuyingprice] = useState('');
  const [quantity, setQuantity] = useState('');

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isUpdateMode) {
      if (selectedProduct) {
        try {
          const updatedProduct = {
            name,
            buyingPrice,
            sellingPrice,
            quantity,
          };
          const productRef = doc(db, 'products', selectedProduct.id);
          await updateDoc(productRef, updatedProduct);

          setName('');
          setBuyingprice('');
          setSellingPrice('');
          setQuantity('');
          setSelectedProduct(null);

          setIsUpdateMode(false);

          alert('Updated product succesfully!!');
        } catch (error) {
          console.error('failed to update product', error);
        }
      }
    } else {
      const added = await addProductToFirestore(
        name,
        Number(buyingPrice),
        Number(sellingPrice),
        Number(quantity)
      );
      if (added) {
        setName('');
        setBuyingprice('');
        setSellingPrice('');
        setQuantity('');
        alert('product added successfully');
      }
    }
  };

  const handleUpdateClick = (product) => {
    setName(product.name || '');
    setBuyingprice(product.buyingPrice || '');
    setSellingPrice(product.sellingPrice || '');
    setQuantity(product.quantity || '');

    setSelectedProduct(product);
    setIsUpdateMode(true);
  };

  return (
    <div className="h-screen">
      <h1
        className={
          'font-bold uppercase text-center text-3xl md:text-4xl p-2 text-[#48F2FB] ' +
          rubik.className
        }
      >
        emmax
      </h1>
      <div className="flex justify-center capitalize  ">
        <form className="flex flex-col gap-3 shadow-md shadow-gray-400 rounded-xl p-4">
          <h3 className={'text-xl sm:text-3xl ' + fugaz.className}>
            create your product
          </h3>
          <lebel>name</lebel>
          <input
            className="bg-gray-200 rounded-xl"
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <lebel>buying price</lebel>
          <input
            className="bg-gray-200 rounded-xl"
            id="buyingprice"
            name="buying price"
            type="number"
            required
            value={buyingPrice}
            onChange={(e) => setBuyingprice(e.target.value)}
          />
          <lebel>selling price</lebel>
          <input
            className="bg-gray-200 rounded-xl"
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            required
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
          />
          <lebel>quantity</lebel>
          <input
            className="bg-gray-200 rounded-xl"
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
            className="rounded-full bg-green-200 hover:bg-green-500 hover:scale-105 ease-in duration-300 shadow-md shadow-gray-300 mt-3 p-2"
            
          >
            { isUpdateMode ? "Update Todo " : "Create Product" }
          </button>
        </form>
      </div>
    </div>
  );
}
