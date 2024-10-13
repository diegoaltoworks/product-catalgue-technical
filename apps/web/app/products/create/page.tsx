import React, { Suspense } from "react";
import CreateProductForm from "~/components/Products/CreateProductForm";

export default function Page(): React.ReactNode {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateProductForm />
    </Suspense>
  );
}
