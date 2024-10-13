"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/navigation";
import { useProduct } from "~/hooks/useProduct";

export default function EditProductForm() {
  const product = useProduct();
  // fixed! no need to ts-ignore any more
  const utils = trpc.useUtils();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  // fixed! no need to ts-ignore any more
  const { mutate } = trpc.products.delete.useMutation({
    onSuccess() {
      utils.products.all.invalidate();
      utils.products.search.invalidate();
      router.back();
    },
  });

  if (!product) return ",,, ";

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      mutate({ id: product.id });
    } catch (err) {
      console.error(err);
      setError("Unable to fetch response");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Delete Product</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>Are you sure you want to delete {product.name}?</div>
        <div className="flex gap-10 flex-row">
          <Button
            type="button"
            onClick={() => router.back()}
            className="w-1/2 py-2 px-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-indigo-700"
          >
            Yes, Delete Product
          </Button>
        </div>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          <h3 className="text-lg font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
