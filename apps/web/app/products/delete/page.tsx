import React, { Suspense } from "react";
import DeleteProductForm from "~/components/Products/DeleteProductForm";

export default function Page(): React.ReactNode {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeleteProductForm />
    </Suspense>
  );
}
