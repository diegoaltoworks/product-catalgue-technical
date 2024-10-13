"use client";

import { trpc } from "~/utils/trpc";
import { Button } from "@repo/ui/button";
import { SearchInput, searchInput, ProductProps } from "~/schema";
import { useParsedQueryParams } from "~/hooks/useParsedQueryParams";
import Link from "next/link";

export default function ListProductsTable() {
  const search = useParsedQueryParams<SearchInput>(searchInput);
  // fixed! no need to ts-ignore any more
  const { data, isLoading, error } = trpc.products.search.useQuery(
    {
      keyword: search.keyword,
      page: search.page,
      limit: search.limit,
    },
    {
      keepPreviousData: true,
    },
  );

  const { data: products, meta } = data || {};

  const updateState = (update: any) => {
    const np = { ...search, ...update };
    const nq = new URLSearchParams(np).toString();
    window.history.pushState(null, "", `?${nq}`);
  };

  const handleNextPage = () => {
    updateState({ page: search.page + 1 });
  };

  const handlePreviousPage = () => {
    if (search.page > 1) {
      updateState({ page: search.page - 1 });
    }
  };

  if (error) return <div>Error loading products</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const keyword = formData.get("keyword") as string;
          const limit = parseInt(formData.get("limit") as string, 10);
          updateState({ keyword, limit, page: 1 });
        }}
        className="flex justify-start mb-4 relative"
      >
        <div className="inline-block relative w-64">
          <input
            type="text"
            name="keyword"
            defaultValue={search.keyword}
            placeholder="Search keyword"
            className="border border-gray-300 rounded py-2 px-4 mr-2"
          />
          {search.keyword && (
            <button
              type="button"
              onClick={() => updateState({ keyword: "", page: 1 })}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              &#x2716;
            </button>
          )}
        </div>

        <Button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
        >
          Search
        </Button>

        <select
          name="limit"
          defaultValue={search.limit}
          className="border border-gray-300 rounded py-2 px-4 ml-2"
          onChange={(e) => {
            e.target.form?.submit();
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </form>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">SKU</th>
            <th className="py-2 px-4 border-b text-left">Quantity</th>
            <th className="py-2 px-4 border-b text-left">Description</th>
            <th className="py-2 px-4 border-b text-right w-10">Edit</th>
            <th className="py-2 px-4 border-b text-right w-10">Delete</th>
          </tr>
        </thead>
        <tbody className={isLoading ? "opacity-50" : ""}>
          {products?.map((product: ProductProps) => (
            <tr key={product.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{product.sku}</td>
              <td className="py-2 px-4 border-b">{product.quantity}</td>
              <td className="py-2 px-4 border-b">{product.description}</td>
              <td className="py-2 px-4 border-b text-right w-10">
                <Link
                  href={{
                    pathname: "/products/edit",
                    query: { id: product.id },
                  }}
                >
                  edit
                </Link>
              </td>
              <td className="py-2 px-4 border-b text-right w-10">
                <Link
                  href={{
                    pathname: "/products/delete",
                    query: { id: product.id },
                  }}
                >
                  delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <Button
          onClick={handlePreviousPage}
          disabled={search.page === 1}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={meta && search.page >= meta.rowCount / search.limit}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
