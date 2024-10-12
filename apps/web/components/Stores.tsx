"use client"
import { trpc } from "@/utils/trpc";

export default function Stores() {
	const stores = trpc.stores.all.useQuery();
return (
    <div>
		<h1>Stores</h1>
		<pre>{JSON.stringify(stores,null,2)}</pre>
    </div>
  );
}
