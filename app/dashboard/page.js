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
  const [stockValue, setStockValue] = useState(0);
  const [potentialProfit, setPotentialProfit] = useState(0);

  const [salesData, setSalesData] = useState([]);
  const [productsData, setProductsData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [mostSoldProduct, setMostSoldProduct] = useState(null);
  
  const LOW_STOCK_THRESHOLD = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch sales data
        const salesRef = collection(db, 'sales');
        const salesSnapshot = await getDocs(salesRef);
        const sales = salesSnapshot.docs.map((doc) => doc.data());

        // Fetch product data
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);
        const products = {};
        const productList = productsSnapshot.docs.map((doc) => {
          const product = { id: doc.id, ...doc.data() };
          products[doc.id] = product;
          return product;
        });

        // Initialize metrics
        let salesCount = 0;
        let revenue = 0;
        let profit = 0;
        let stockValueTotal = 0;
        let potentialProfitTotal = 0;
        const lowStock = [];

        // Identify low-stock products and calculate stock value
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
        sales.forEach((sale) => {
          salesCount++;
          const saleQuantity = sale.quantity || 0;
          const salePricePerUnit = sale.sellingPrice || 0;
          revenue += salePricePerUnit * saleQuantity;

          const product = products[sale.productId];
          if (product) {
            const cost = (product.buyingPrice || 0) * saleQuantity;
            const saleRevenue = salePricePerUnit * saleQuantity;
            profit += saleRevenue - cost;
          }
        });

        // Update state for global metrics
        setTotalSales(salesCount);
        setTotalRevenue(revenue);
        setTotalProfit(profit);
        setTotalProducts(productList.length);
        setLowStockProducts(lowStock);
        setStockValue(stockValueTotal);
        setPotentialProfit(potentialProfitTotal);

        // Update data for filtering
        setSalesData(sales);
        setProductsData(products);
      } catch (error) {
        console.error('Failed to fetch data:', error.message);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Filter and calculate monthly data when selected month changes
    const calculateMonthlyMetrics = () => {
      let revenue = 0;
      let profit = 0;
      const productFrequency = {};

      // Filter sales for the selected month and year
      const filteredSales = salesData.filter((sale) => {
        const saleDate = sale.saleDate?.toDate() || new Date();
        return (
          saleDate.getMonth() === selectedMonth &&
          saleDate.getFullYear() === selectedYear
        );
      });

      filteredSales.forEach((sale) => {
        const product = productsData[sale.productId];
        if (!product) return;

        const saleQuantity = sale.quantity || 0;
        const salePricePerUnit = sale.sellingPrice || 0;
        const cost = (product.buyingPrice || 0) * saleQuantity;
        const saleRevenue = salePricePerUnit * saleQuantity;

        revenue += saleRevenue;
        profit += saleRevenue - cost;

        // Track product frequency
        if (productFrequency[sale.productId]) {
          productFrequency[sale.productId] += saleQuantity;
        } else {
          productFrequency[sale.productId] = saleQuantity;
        }
      });

      // Determine the most frequently sold product
      const mostSoldProductId = Object.keys(productFrequency).reduce(
        (mostFrequent, productId) =>
          productFrequency[productId] >
          (productFrequency[mostFrequent] || 0)
            ? productId
            : mostFrequent,
        null
      );

      setMonthlyRevenue(revenue);
      setMonthlyProfit(profit);
      setMostSoldProduct(
        mostSoldProductId ? productsData[mostSoldProductId] : null
      );
    };

    calculateMonthlyMetrics();
  }, [selectedMonth, selectedYear, salesData, productsData]);

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

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

        {/* Global Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h3 className={"text-xl font-bold " + fugaz.className}>Stock Value</h3>
            <p className="text-2xl">ksh {stockValue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-teal-100 rounded-lg shadow">
            <h3 className={"text-xl font-bold " + fugaz.className}>Potential Profit</h3>
            <p className="text-2xl">ksh {potentialProfit.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h3 className={"text-xl font-bold " + fugaz.className}>Total Revenue</h3>
            <p className="text-2xl">ksh {totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg shadow">
            <h3 className={"text-xl font-bold " + fugaz.className}>Total Profit</h3>
            <p className="text-2xl">ksh {totalProfit.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-purple-100 rounded-lg shadow">
            <h3 className={"text-xl font-bold " + fugaz.className}>Total Products</h3>
            <p className="text-2xl">{totalProducts}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow">
            <h3 className={"text-xl font-bold " + fugaz.className}>Total Sales</h3>
            <p className="text-2xl">{totalSales}</p>
          </div>
        </div>

        {/* Month Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 ">
          <div>
            <label className={"block font-bold text-lg text-white " + fugaz.className}>Select Month</label>
            <select
              className="p-2 border rounded-md"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index} value={index}>
                  {new Date(2024, index).toLocaleString('default', {
                    month: 'long',
                  })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={"block font-bold text-lg text-white " + fugaz.className}>Select Year</label>
            <select
              className="p-2 border rounded-md"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <option key={index} value={2024 - index}>
                  {2024 - index}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Monthly Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h3 className={"text-xl font-bold " + fugaz.className}>Monthly Revenue</h3>
            <p className="text-2xl">ksh {monthlyRevenue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg shadow">
            <h3 className={"text-xl font-bold " + fugaz.className}>Monthly Profit</h3>
            <p className="text-2xl">ksh {monthlyProfit.toFixed(2)}</p>
          </div>
            {/* Most Sold Product */}
        <div className="p-4 bg-green-100 rounded-lg shadow">
          <h3 className={"text-xl font-bold " + fugaz.className}>Most Frequently Sold Product</h3>
          {mostSoldProduct ? (
            <p className="text-2xl">
              {mostSoldProduct.name} - {mostSoldProduct.quantity || 0} units sold
            </p>
          ) : (
            <p className="text-2xl text-red-500">No data available</p>
          )}
        </div>
        </div>

      

        {/* Low Stock Alerts */}
        <div className="mt-6 text-center">
          <h3
            className={`text-2xl font-bold bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent ${fugaz.className}`}
          >
            Low Stock Alerts
          </h3>
          {lowStockProducts.length > 0 ? (
            <ul className="pl-5 text-xl text-red-600 md:grid grid-cols-3">
              {lowStockProducts.map((product) => (
                <li key={product.id} className="mt-2">
                  <strong>{product.name}</strong> - {product.quantity} left
                </li>
              ))}
            </ul>
          ) : (
            <p className={"text-green-500 mt-2 " + fugaz.className}>
              All products have sufficient stock.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
