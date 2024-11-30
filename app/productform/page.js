

import React, { Suspense } from 'react';
import ProductForm from '../(components)/FormFill';

export default function ProductFormPage({ searchParams }) {
  const productId = searchParams?.id;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductForm productId={productId} />
    </Suspense>
  );
}
