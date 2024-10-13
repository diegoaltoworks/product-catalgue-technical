"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { productSchema, ProductProps, productIDSchema } from "~/schema";
import { trpc } from "~/utils/trpc";
import { useProduct } from "~/hooks/useProduct";
import { useRouter } from "next/navigation";

export default function EditProductForm() {
  const stores = trpc.stores.all.useQuery().data;
  const product = useProduct();
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
    defaultValues: product || undefined,
  });
  const [error, setError] = useState<string | undefined>();
  const {
    mutate,
    isLoading,
    data: response,
    // fixed! no need to ts-ignore any more
  } = trpc.products.update.useMutation({
    onSuccess() {
      utils.products.all.invalidate();
      utils.products.search.invalidate();
      utils.products.one.invalidate({ id: product?.id });
      router.back();
    },
  });

  useEffect(() => {
    if (!product) return;
    reset(product);
  }, [product]);

  const onSubmit = async (data: ProductProps) => {
    if (Object.keys(errors).length > 0) return;
    if (!product?.id) return;
    try {
      console.warn("EditProductForm data", data);
      mutate({ ...data, id: product.id });
    } catch (err) {
      console.error(err);
      setError("Unable to fetch response");
    }
  };

  useEffect(() => {
    if (response?.id) {
      reset();
    }
  }, [response]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
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
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            disabled={isLoading}
          >
            Save Changes
          </Button>
        </div>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          <h3 className="text-lg font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      )}
      {response && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          <p>Product Updated!</p>
        </div>
      )}
    </div>
  );
}
