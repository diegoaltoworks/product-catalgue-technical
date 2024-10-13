"use client";
import React from "react";
import { trpc } from "~/utils/trpc";
import { UploadImporter } from "./UploadImporter";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";

export default function Upload() {
  const router = useRouter();
  const [added, setAdded] = React.useState<any[]>([]);
  const [failed, setFailed] = React.useState<any[]>([]);
  const { client } = trpc.useUtils();

  console.log("IMPORT!", { added, failed });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Products</h1>
      <UploadImporter
        dataHandler={async (data, props) => {
          const { startIndex } = props;
          const newQueue = data.slice(startIndex);
          console.log("dataHandler", { newQueue, data, props, startIndex });
          setAdded([]);
          for (const product of newQueue) {
            console.log("CreateProduct", { product });
            try {
              const result = await client.products.create.mutate(product);
              console.log("CreateProduct result", { product, result });
              // va piano = go slowly
              await (() =>
                new Promise((resolve) =>
                  setTimeout(() => {
                    setAdded((prev) => [...prev, result]);
                    resolve(void 0);
                  }, 1000),
                ))();
            } catch (error) {
              console.error("CreateProduct error", { product, error });
              setFailed((prev) => [...prev, { product, error }]);
            }
          }
        }}
        onStart={({ file, preview, fields, columnFields }) => {
          console.log("onStart", { file, preview, fields, columnFields });
        }}
        onComplete={({ file, preview, fields, columnFields }) => {
          console.log("onComplete", { file, preview, fields, columnFields });
        }}
        onClose={({ file, preview, fields, columnFields }) => {
          console.log("onClose", { file, preview, fields, columnFields });
          router.push("/products");
        }}
      />
      {failed?.length > 0 && (
        <div>
          <h3>Could not upload the following products</h3>
          {failed.map(({ product, error }) => (
            <div
              key={product.id}
              className="bg-red-100 text-red-700 px-4 py-2 rounded"
            >
              {product.name} failed: {error.message}
              <pre>
                <code>{JSON.stringify(product, null, 2)}</code>
              </pre>
              <Button onClick={() => alert("TODO!")}>Edit and Retry</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
