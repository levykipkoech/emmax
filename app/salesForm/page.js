"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { logSale } from '../utils/LogSale';
import Navbar from '../(components)/Navbar';
import { Fugaz_One } from 'next/font/google';
import { useRouter, useSearchParams } from 'next/navigation';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function SalesForm() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saleId, setSaleId] = useState(null);
  const [originalQuantity, setOriginalQuantity] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchProducts() {
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);
      const fetchedProducts = [];
      querySnapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() });
      });
      setProducts(fetchedProducts);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id && !searchParams.get('productId')) {
      const fetchSale = async () => {
        const saleRef = doc(db, 'sales', id);
        const saleSnap = await getDoc(saleRef);
        if (saleSnap.exists()) {
          const saleData = saleSnap.data();
          setIsEditing(true);
          setSaleId(id);
          setSearchTerm(saleData.productName);
          setQuantity(saleData.quantity);
          setCustomerName(saleData.customerName || '');
          setSelectedProduct({ id: saleData.productId, name: saleData.productName });
          setOriginalQuantity(Number(saleData.quantity));
        }
      };
      fetchSale();
    }
  }, [searchParams]);
  

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) {
      alert('Please fill out all required fields');
      return;
    }

    if (isEditing) {
      try {
        const saleRef = doc(db, 'sales', saleId);
        const productRef = doc(db, 'products', selectedProduct.id);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          alert('Product not found');
          return;
        }

        const productData = productSnap.data();
        const adjustedStock = productData.quantity + originalQuantity - Number(quantity);

        if (adjustedStock < 0) {
          alert('Insufficient stock to update sale');
          return;
        }

        await updateDoc(saleRef, {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity: Number(quantity),
          customerName,
        });

        await updateDoc(productRef, {
          quantity: adjustedStock,
        });

        alert('Sale updated successfully!');
        router.push('/sales');
      } catch (error) {
        console.error('Error updating sale:', error);
        alert('Failed to update the sale.');
      }
    } else {
      const success = await logSale(
        selectedProduct.id,
        Number(quantity),
        customerName
      );
      if (success) {
        setSearchTerm('');
        setSelectedProduct(null);
        setQuantity('');
        setCustomerName('');
        router.push('/sales');
      }
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
          {isEditing ? 'Edit Sale' : 'Log a Sale'}
        </h2>
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-lg w-full p-4"
          >
            <label>
              <p
                className={
                  'font-semibold text-orange-400 text-xl ' + fugaz.className
                }
              >
                Product:
              </p>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a product"
                className="w-full p-2 border border-gray-300 rounded-lg"
                disabled={isEditing} // Prevent editing product during update
              />
              {filteredProducts.length > 0 && (
                <ul className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <li
                      key={product.id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setSearchTerm(product.name);
                        setFilteredProducts([]);
                      }}
                    >
                      {product.name} (Stock: {product.quantity})
                    </li>
                  ))}
                </ul>
              )}
            </label>
            <label
              className={'font-semibold text-orange-400 ' + fugaz.className}
            >
              Quantity:
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </label>
            <label
              className={'font-semibold text-orange-400 ' + fugaz.className}
            >
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
              {isEditing ? 'Update Sale' : 'Log Sale'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
