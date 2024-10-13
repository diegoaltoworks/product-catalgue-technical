import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

type ErrorMapping = {
  [key: string]: {
    code: TRPCError["code"];
    message: string;
  };
};

const defaultErrorMapping: ErrorMapping = {
  P2002: {
    code: "CONFLICT",
    message: "A record with this identifier already exists.",
  },
  P2003: {
    code: "BAD_REQUEST",
    message: "Invalid foreign key. The referenced record does not exist.",
  },
  P2025: {
    code: "NOT_FOUND",
    message: "Record to update not found.",
  },
  // Add more Prisma error codes as needed
};

export function handlePrismaError(error: unknown, customErrorMapping: ErrorMapping = {}): never {
  const errorMapping = { ...defaultErrorMapping, ...customErrorMapping };

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const mappedError = errorMapping[error.code];
    if (mappedError) {
      throw new TRPCError({
        code: mappedError.code,
        message: mappedError.message,
      });
    }
  }

  // For unknown Prisma errors or other types of errors
  console.error("Unexpected error:", error);
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
  });
}
