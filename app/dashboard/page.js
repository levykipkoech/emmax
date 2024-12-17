'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../(components)/Navbar';
import { Fugaz_One, Rubik_Wet_Paint } from 'next/font/google';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const rubik = Rubik_Wet_Paint({ subsets: ['latin'], weight: '400' });
const fugaz = Fugaz_One({ subsets: ['latin'], weight: '400' });

export default function DashboardPage() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0); // New: Monthly revenue
  const [monthlyProfit, setMonthlyProfit] = useState(0); // New: Monthly profit
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [stockValue, setStockValue] = useState(0);
  const [potentialProfit, setPotentialProfit] = useState(0);

  const LOW_STOCK_THRESHOLD = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const salesRef = collection(db, 'sales');
        const salesSnapshot = await getDocs(salesRef);
        const salesData = salesSnapshot.docs.map((doc) => doc.data());

        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);

        const productsData = {};
        const productList = productsSnapshot.docs.map((doc) => {
          const product = { id: doc.id, ...doc.data() };
          productsData[doc.id] = product;
          return product;
        });

        let salesCount = 0;
        let revenue = 0;
        let profit = 0;
        let stockValueTotal = 0;
        let potentialProfitTotal = 0;
        let currentMonthRevenue = 0; // New: Monthly revenue accumulator
        let currentMonthProfit = 0; // New: Monthly profit accumulator

        const lowStock = [];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Calculate stock value and identify low-stock products
        productList.forEach((product) => {
          if (product.quantity <= LOW_STOCK_THRESHOLD) {
            lowStock.push({
              id: product.id,
              name: product.name,
              quantity: product.quantity,
            });
          }
          const productStockValue =
            (product.buyingPrice || 0) * (product.quantity || 0);
          const productPotentialProfit =
            ((product.sellingPrice || 0) - (product.buyingPrice || 0)) *
            (product.quantity || 0);

          stockValueTotal += productStockValue;
          potentialProfitTotal += productPotentialProfit;
        });

        // Process sales data
        salesData.forEach((sale) => {
          salesCount++;
          const saleQuantity = sale.quantity || 0;
          const salePricePerUnit = sale.sellingPrice || 0;
          const saleDate = sale.saleDate?.toDate() || new Date(); // Convert Firestore Timestamp to JS Date
          const saleMonth = saleDate.getMonth();
          const saleYear = saleDate.getFullYear();

          revenue += salePricePerUnit * saleQuantity;

          const product = productsData[sale.productId];
          if (product) {
            const cost = (product.buyingPrice || 0) * saleQuantity;
            const saleProfit = salePricePerUnit * saleQuantity - cost;
            profit += saleProfit;

            // Check if the sale belongs to the current month
            if (saleMonth === currentMonth && saleYear === currentYear) {
              currentMonthRevenue += salePricePerUnit * saleQuantity;
              currentMonthProfit += saleProfit;
            }
          }
        });

        // Update state
        setTotalSales(salesCount);
        setTotalRevenue(revenue);
        setTotalProfit(profit);
        setMonthlyRevenue(currentMonthRevenue); // Update monthly revenue
        setMonthlyProfit(currentMonthProfit); // Update monthly profit
        setTotalProducts(productList.length);
        setLowStockProducts(lowStock);
        setStockValue(stockValueTotal);
        setPotentialProfit(potentialProfitTotal);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error.message);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="p-6">
        <h1
          className={`capitalize tracking-widest font-extrabold text-center text-4xl bg-gradient-to-r from-red-600 to-green-400 bg-clip-text text-transparent ${fugaz.className}`}
        >
          Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 my-6 items-center">
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Stock Value</h3>
            <p className="text-2xl">ksh {stockValue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-teal-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Potential Profit</h3>
            <p className="text-2xl">ksh {potentialProfit.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Total Revenue</h3>
            <p className="text-2xl">ksh {totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Total Profit</h3>
            <p className="text-2xl">ksh {totalProfit.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 my-6">
          <div className="p-4 bg-yellow-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Monthly Revenue</h3>
            <p className="text-2xl">ksh {monthlyRevenue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Monthly Profit</h3>
            <p className="text-2xl">ksh {monthlyProfit.toFixed(2)}</p>
          </div>

          <div className="p-4 bg-purple-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Total Products</h3>
            <p className="text-2xl">{totalProducts}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Total Sales</h3>
            <p className="text-2xl">{totalSales}</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <h3
            className={`text-2xl font-bold bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent ${fugaz.className}`}
          >
            Low Stock Alerts
          </h3>
          {lowStockProducts.length > 0 ? (
            <ul className=" pl-5 text-xl text-red-600 md:grid grid-cols-3">
              {lowStockProducts.map((product) => (
                <li key={product.id} className="mt-2">
                  <strong>{product.name}</strong> - {product.quantity} left
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
