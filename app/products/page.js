'use client';
import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import { MdModeEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
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
import Navbar from '../(components)/Navbar';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });
const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });

async function fetchProductsFromFirestore() {
  try {
    const productCollection = query(collection(db, 'products'));
    const productsQuery = query(
      productCollection,
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(productsQuery);
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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const products = await fetchProductsFromFirestore();
      setProducts(products);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter((prod) =>
          prod.name.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
  }, [searchQuery, products]);

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
    <div className="  ">
      <h1 className="sticky top-0 ">
        <Navbar />
      </h1>
      <div className="h-screen">
        <div className='place-items-end '>
          <input
            type="text"
            placeholder="Search by product name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" p-2 m-4  border border-gray-300 rounded-lg flex justify-end"
          />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4  text-md">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gradient-to-tl from-orange-700 to-gray-600 text-white shadow-md shadow-gray-400 capitalize rounded-xl p-4 text-center overflow-hidden transition "
            >
              <div className="border-b-2 rounded-md pb-2 uppercase font-semibold">
                <p>{product.name}</p>
              </div>
              <div className="flex justify-between pt-2 text-md">
                <p>BP: {product.buyingPrice}</p>
                <p>SP: {product.sellingPrice}</p>
              </div>
              <p className="pt-2 ">Quantity: {product.quantity}</p>
              <div className="flex justify-between gap-12 pt-4">
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-300  hover:bg-red-400 shadow-md shadow-gray-500 rounded-full px-4 py-2 transition hover:scale-105 ease-in duration-100  "
                >
                  <MdDelete />
                </button>
                <button
                  onClick={() => handleUpdateClick(product)}
                  className="bg-orange-300 hover:bg-orange-400 shadow-md shadow-gray-500 rounded-full text-xl px-4 py-2 transition hover:scale-105 ease-in duration-100  "
                >
                  <MdModeEdit />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
