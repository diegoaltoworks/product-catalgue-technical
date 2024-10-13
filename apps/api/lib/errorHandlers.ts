import logger from "./logger";
import { BaseError } from "./errorTypes";
import type { Request, Response, NextFunction } from "express";

export const expressErrorHandler = (
  err: Error,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const error = err as BaseError;
  logger.error("expressErrorHandler", error.toString());
  res.status(error.statusCode || 500).json(error);
};

export const uncaughtExceptionHandler = (err: unknown) => {
  const error = err as BaseError;
  console.error("uncaughtExceptionHandler", error);
  logger.error("uncaughtExceptionHandler", error.toString());
};

export const uncaughtException = (err: unknown) => {
  const error = err as BaseError;
  console.error("uncaughtException", error);
  logger.error("uncaughtException", error.toString());
};

export const unhandledRejection = (err: unknown) => {
  const error = err as BaseError;
  console.error("unhandledRejection", error);
  logger.error("unhandledRejection", error.toString());
};

export const SIGTERM = () => {
  logger.error("SIGTERM received. Shutting down gracefully");
};
