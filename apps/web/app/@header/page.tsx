import Link from "next/link";
import React from "react";

export default function Page(): React.ReactNode {
  return (
    <div className="flex flex-row items-center justify-between p-4">
      <h1 className="text-2xl font-bold text-white-800">
        <Link href="/" className="hover:text-white-100">
          Product Manager
        </Link>
      </h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/products" className="hover:text-white-100">
              Products
            </Link>
          </li>
          <li>
            <Link href="/products/create" className="hover:text-white-100">
              Create
            </Link>
          </li>
          <li>
            <Link href="/products/upload" className="hover:text-white-100">
              Upload
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
