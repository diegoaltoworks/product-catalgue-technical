import React, { Suspense } from "react";
import EditProductForm from "~/components/Products/EditProductForm";

export default function Page(): React.ReactNode {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProductForm />
    </Suspense>
  );
}
