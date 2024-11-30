'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { logSale } from '../utils/LogSale';

export default function SalesForm() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [customerName, setCustomerName] = useState('');

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
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Log a Sale</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Product:
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="" disabled>
              Select a product
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (Stock: {product.quantity})
              </option>
            ))}
          </select>
        </label>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </label>
        <label>
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
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Log Sale
        </button>
      </form>
    </div>
  );
}
