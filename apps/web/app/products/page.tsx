import { Suspense } from "react";
import ListProductsTable from "~/components/Products/ListProductsTable";

export default function Page(): React.ReactNode {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <ListProductsTable />
      </Suspense>
    </main>
  );
}
