import React, { Suspense } from 'react'
import SalesFormPageContent from '../(components)/SalesFormFill';
import Navbar from '../(components)/Navbar';

export default function SalesFormWrapper() {
  return (
    <div>
      <div className="sticky top-0">
        <Navbar />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SalesFormPageContent />
      </Suspense>
    </div>
  );
}
