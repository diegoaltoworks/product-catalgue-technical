"use client"
import { trpc } from "@/utils/trpc";

export default function Products() {
	const products = trpc.products.all.useQuery();
return (
    <div>
		<h1>Products</h1>
		<pre>{JSON.stringify(products,null,2)}</pre>
    </div>
  );
}
