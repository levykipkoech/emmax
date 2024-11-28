'use client';
import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });
const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });

async function fetchProductsFromFirestore() {
  try {
    const productCollection = query(
      collection(db, 'products'),
      
    );
    const querySnapshot = await getDocs(productCollection);
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return products;
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

async function deleteProductFromFirestore(productId) {
  try {
    await deleteDoc(doc(db, 'products', productId));
    console.log(`Product with ID ${productId} deleted successfully.`);
    return productId;
  } catch (err) {
    console.error('Failed to delete product:', err);
    return null;
  }
}

export default function Product() {
  const [products, setProducts] = useState([]);
  const router = useRouter();


  useEffect(() => {
    async function fetchProducts() {
      const products = await fetchProductsFromFirestore();
      setProducts(products);
    }
    fetchProducts();
  }, []);
  
  const handleUpdateClick = (product) => {
    router.push(`/productform?id=${product.id}`); // Navigate to the form with product ID
   
  };
  const handleDelete = async (productId) => {
    const deletedId = await deleteProductFromFirestore(productId);
    if (deletedId) {
      setProducts(products.filter((product) => product.id !== deletedId));
    }
  };



  return (
    <div>
      <h1
        className={
          'font-bold uppercase text-center text-base md:text-4xl p-2 text-[#48F2FB] ' +
          rubik.className
        }
      >
        emmax
      </h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white text-black shadow-md shadow-gray-400 capitalize rounded-xl p-4 text-center overflow-hidden"
          >
            <div className="border-b-2 rounded-md pb-2 uppercase font-semibold">
              <p>{product.name}</p>
            </div>
            <div className="flex justify-between pt-2 text-sm">
              <p>BP: {product.buyingPrice}</p>
              <p>SP: {product.sellingPrice}</p>
            </div>
            <p className="pt-2 text-sm">Quantity: {product.quantity}</p>
            <div className="flex justify-between pt-4">
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-100 hover:bg-red-400 shadow-md shadow-gray-500 rounded-full px-4 py-2"
              >
                Delete
              </button>
              <button onClick={()=> handleUpdateClick(product)} className="bg-green-100 hover:bg-green-400 shadow-md shadow-gray-500 rounded-full px-4 py-2">
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
