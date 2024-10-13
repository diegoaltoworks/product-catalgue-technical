type ErrorInfo = unknown;

export type ErrorJSON = {
  statusCode: number;
  type: string;
  info: object;
  error: string;
};
export class BaseError extends Error {
  public isOperationalError: boolean;
  public statusCode: number;
  public type: string;
  public info: ErrorInfo;

  constructor(
    type: string,
    statusCode: number,
    message: string,
    info?: ErrorInfo,
    isOperationalError = false
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.type = type;
    this.info = info;
    this.isOperationalError = isOperationalError;
    Error.captureStackTrace(this, this.constructor);
  }
  toString() {
    return `${this.type}: ${this.message}`;
  }
  toJSON() {
    return {
      statusCode: this.statusCode,
      type: this.type,
      info: this.info,
      message: this.message,
    };
  }
}

export class AppError extends BaseError {
  constructor(
    type: string,
    message: string,
    info?: ErrorInfo,
    statusCode: number | undefined | null = 500
  ) {
    super(type, statusCode || 500, message, info, true);
  }
}
export class ConfigError extends AppError {
  constructor(message: string, info?: ErrorInfo) {
    super("ConfigError", message, info);
  }
}
export class RuntimeError extends AppError {
  constructor(message: string, info?: ErrorInfo) {
    super("RuntimeError", message, info);
  }
}
export class ExternalError extends AppError {
  constructor(message: string, info?: ErrorInfo) {
    super("ExternalError", message, info);
  }
}
//todo: extend  app error with specific types of external error

export class UserError extends BaseError {
  constructor(
    type: string,
    message: string,
    info?: ErrorInfo,
    statusCode: number | undefined | null = 400
  ) {
    super(type, statusCode || 400, message, info);
  }
}
export class InputError extends UserError {
  constructor(message: string, info?: ErrorInfo) {
    super("InputError", message, info, 401);
  }
}
export class AuthError extends UserError {
  constructor(message: string, info?: ErrorInfo) {
    super("AuthError", message, info, 403);
  }
}
export class NotFoundError extends UserError {
  constructor(message: string, info?: ErrorInfo) {
    super("NotFoundError", message, info, 404);
  }
}
