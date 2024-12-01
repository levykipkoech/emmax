'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../(components)/Navbar';
import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: '400' });
const fugaz = Fugaz_One({ subsets: ['latin'], weight: '400' });

export default function DashboardPage() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const LOW_STOCK_THRESHOLD = 10; // Threshold for low stock warnings

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch sales data
        const salesRef = collection(db, 'sales');
        const salesSnapshot = await getDocs(salesRef);
        const salesData = salesSnapshot.docs.map((doc) => doc.data());

        // Fetch product data
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);

        // Create a map of products by their IDs
        const productsData = {};
        const productData = productsSnapshot.docs.map((doc) => {
          const product = { id: doc.id, ...doc.data() };
          productsData[doc.id] = product;
          return product;
        });

        // Calculate metrics
        let salesCount = 0;
        let revenue = 0;
        let profit = 0;
        const lowStock = [];

        productData.forEach((product) => {
          if (product.quantity <= LOW_STOCK_THRESHOLD) {
            lowStock.push({
              id: product.id,
              name: product.name,
              quantity: product.quantity,
            });
          }
        });

        salesData.forEach((sale) => {
          salesCount++;
          revenue += sale.totalPrice || 0;

          if (Array.isArray(sale.products)) {
            sale.products.forEach((saleProduct) => {
              const product = productsData[saleProduct.productId];
              if (product) {
                const cost = product.buyingPrice * (saleProduct.quantity || 0);
                const saleRevenue =
                  (product.sellingPrice || 0) * (saleProduct.quantity || 0);
                profit += saleRevenue - cost;
              }
            });
          }
        });

        // Update state
        setTotalSales(salesCount);
        setTotalRevenue(revenue);
        setTotalProfit(profit);
        setTotalProducts(productData.length);
        setLowStockProducts(lowStock);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error.message);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="p-6">
        <h1
          className={`capitalize tracking-widest font-extrabold text-center text-4xl text-orange-400 ${fugaz.className}`}
        >
          Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 my-6">
          <div className="p-4 bg-green-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Total Sales</h3>
            <p className="text-2xl">{totalSales}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Total Revenue</h3>
            <p className="text-2xl">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Total Profit</h3>
            <p className="text-2xl">${totalProfit.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-purple-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Total Products</h3>
            <p className="text-2xl">{totalProducts}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h3 className={"text-2xl font-bold bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent   " + fugaz.className}>Low Stock Alerts</h3>
          {lowStockProducts.length > 0 ? (
            <ul className="list-none pl-5 text-xl text-red-600">
              {lowStockProducts.map((product) => (
                <li key={product.id} className="mt-2">
                  <strong>{product.name}</strong> -  {product.quantity} left
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-500 mt-2">
              All products have sufficient stock.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
