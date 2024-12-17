import { db } from '@/firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

export async function logSale(productId, quantity, sellingPrice, customerName) {
  try {
    // Validate inputs
    if (quantity <= 0 || sellingPrice <= 0) {
      alert('Quantity and Selling Price must be greater than zero.');
      return false;
    }

    // Get the product details
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      alert('Product not found.');
      console.error('Product not found in the database.');
      return false;
    }

    const productData = productSnap.data();

    // Check stock availability
    if (productData.quantity < quantity) {
      alert('Insufficient stock to complete the sale.');
      return false;
    }

    // Calculate total price
    const totalPrice = sellingPrice * quantity;

    // Add sale transaction
    await addDoc(collection(db, 'sales'), {
      productId,
      productName: productData.name,
      quantity,
      sellingPrice, // Explicitly include selling price
      totalPrice,
      customerName: customerName || null, // Allow optional customer name
      timestamp: serverTimestamp(),
    });

    // Update product stock
    await updateDoc(productRef, {
      quantity: productData.quantity - quantity,
    });

    alert('Sale logged successfully.');
    return true;
  } catch (error) {
    console.error('Error logging sale:', error.message);
    alert('Failed to log the sale. Please try again.');
    return false;
  }
}
