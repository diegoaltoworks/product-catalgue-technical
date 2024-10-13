import Link from "next/link";

export default function Page(): React.ReactNode {
  return (
    <main className="flex flex-col items-center justify-center h-full bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      <div className="space-x-4">
        <Link
          href="/products"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Products
        </Link>
        <Link
          href="/products/upload"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Upload
        </Link>
      </div>
    </main>
  );
}
