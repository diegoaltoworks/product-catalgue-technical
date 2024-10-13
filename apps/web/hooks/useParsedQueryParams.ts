import { useSearchParams } from "next/navigation";
import { ZodSchema } from "zod";

export const useParsedQueryParams = <T>(schema?: ZodSchema) => {
  const searchParams = useSearchParams();
  const params: { [name: string]: string } = Object.fromEntries(
    searchParams.entries(),
  );
  if (schema) {
    return schema.parse(params) as T;
  }
  return params as T;
};
