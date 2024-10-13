"use client";

import { useEffect, useState } from "react";
import { trpc } from "~/utils/trpc";
import { useParsedQueryParams } from "~/hooks/useParsedQueryParams";

// todo: move this to central shema package
import { ExistingProductProps, productIDSchema } from "~/schema/product";

export const useProduct = () => {
  const query = useParsedQueryParams<{ id: number }>(productIDSchema);
  const [product, setProduct] = useState<ExistingProductProps | null>(null);
  // fixed! no need to ts-ignore any more
  const { data: result } = trpc.products.one.useQuery({ id: query.id });

  useEffect(() => {
    if (!result) return;

    setProduct(result);
  }, [result]);

  return product;
};
