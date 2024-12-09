'use client';

import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import { MdModeEdit, MdDelete } from 'react-icons/md';
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
import { useAuth } from '@/context/Authcontext';
//import fetchUserRole from '../(components)/Admin';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });
const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: ['400'] });

// Firestore fetch functions
async function fetchProductsFromFirestore() {
  try {
    const productCollection = collection(db, 'products');
    const productsQuery = query(
      productCollection,
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(productsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

async function deleteProductFromFirestore(productId) {
  try {
    await deleteDoc(doc(db, 'products', productId));
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
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { currentUser, role } = useAuth();


  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await fetchProductsFromFirestore();
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
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

  // Update product
  const handleUpdateClick = (product) => {
    if (!currentUser) {
      alert('You must be logged in to update a product.');
      return;
    }

    if (role === 'admin') {
      router.push(`/productform?id=${product.id}`);
    } else {
      alert('You do not have permission to update this product.');
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!currentUser) {
      alert('You must be logged in to delete a product.');
      return;
    }

    if (isDeleting) return;

    if (role !== 'admin') {
      alert('You do not have permission to delete this product.');
      return;
    }

    setIsDeleting(true);
    try {
      const deletedId = await deleteProductFromFirestore(productId);
      if (deletedId) {
        setProducts((prev) =>
          prev.filter((product) => product.id !== deletedId)
        );
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('An error occurred while deleting the product.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Render component
  return (
    <div>
      <Navbar />
      <div className="h-screen">
        <div className="place-items-end">
          <input
            type="text"
            placeholder="Search by product name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 m-4 border border-gray-300 rounded-lg flex justify-end"
          />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 text-md">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No products found.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gradient-to-tl from-orange-700 to-gray-600 text-white shadow-md shadow-gray-400 capitalize rounded-xl p-4 text-center overflow-hidden transition"
              >
                <div className="border-b-2 rounded-md pb-2 uppercase font-semibold">
                  <p>{product.name}</p>
                </div>
                <div className="flex justify-between pt-2 text-md">
                  <p>BP: {product.buyingPrice}</p>
                  <p>SP: {product.sellingPrice}</p>
                </div>
                <p className="pt-2">Quantity: {product.quantity}</p>
                {(role === 'admin' || role === 'editor') && (
                  <div className="flex justify-between gap-12 pt-4">
                    {role === 'admin' && (
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting}
                        className={`bg-red-300 hover:bg-red-400 shadow-md shadow-gray-500 rounded-full px-4 py-2 transition ${
                          isDeleting
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:scale-105 ease-in duration-100'
                        }`}
                      >
                        <MdDelete />
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateClick(product)}
                      className="bg-orange-300 hover:bg-orange-400 shadow-md shadow-gray-500 rounded-full text-xl px-4 py-2 transition hover:scale-105 ease-in duration-100"
                    >
                      <MdModeEdit />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
