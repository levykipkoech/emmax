import { db } from '@/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';

export async function logSale(productId, quantity, customerName) {
  try {
    // Get the product details
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      console.error('Product not found');
      return false;
    }

    const productData = productSnap.data();
    if (productData.quantity < quantity) {
      alert('Insufficient stock');
      return false;
    }

    // Calculate total price
    const totalPrice = productData.sellingPrice * quantity;

    // Add sale transaction
    await addDoc(collection(db, 'sales'), {
      productId,
      productName: productData.name,
      quantity,
      pricePerUnit: productData.sellingPrice,
      totalPrice,
      customerName,
      timestamp: serverTimestamp(),
    });

    // Update product stock
    await updateDoc(productRef, {
      quantity: productData.quantity - quantity,
    });

    alert('Sale logged successfully');
    return true;
  } catch (error) {
    console.error('Error logging sale:', error);
    return false;
  }
}
