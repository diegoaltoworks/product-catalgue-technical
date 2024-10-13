"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { productSchema, ProductProps } from "~/schema";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/navigation";

export default function CreateProductForm() {
  const stores = trpc.stores.all.useQuery().data;
  // fixed! no need to ts-ignore any more
  const utils = trpc.useUtils();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductProps>({
    resolver: zodResolver(productSchema),
  });
  const [error, setError] = useState<string | undefined>();
  const {
    mutate,
    isLoading,
    data: response,
    // fixed! no need to ts-ignore any more
  } = trpc.products.create.useMutation({
    onSuccess() {
      utils.products.all.invalidate();
      utils.products.search.invalidate();
    },
  });

  const onSubmit = async (data: ProductProps) => {
    if (Object.keys(errors).length > 0) return;

    try {
      mutate(data);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch response");
    }
  };

  useEffect(() => {
    if (response?.[0]?.id) {
      reset();
    }
  }, [response]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            type="text"
            {...register("description")}
            id="description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="sku"
            className="block text-sm font-medium text-gray-700"
          >
            Sku
          </label>
          <input
            type="text"
            {...register("sku")}
            id="sku"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.sku && (
            <p className="mt-2 text-sm text-red-600">{errors.sku.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            type="text"
            {...register("quantity")}
            id="quantity"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.quantity && (
            <p className="mt-2 text-sm text-red-600">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="storeId"
            className="block text-sm font-medium text-gray-700"
          >
            Store
          </label>
          <select
            {...register("storeId")}
            id="storeId"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a store</option>
            {stores?.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>

          {errors.store && (
            <p className="mt-2 text-sm text-red-600">{errors.store.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          disabled={isLoading}
        >
          Add Product
        </Button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          <h3 className="text-lg font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      )}
      {response && (
        <div data-setid="product-added">
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
            <p>Product added!</p>
          </div>
          <Button
            onClick={() => router.push("/products")}
            className="mt-2 w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to List
          </Button>
        </div>
      )}
    </div>
  );
}
