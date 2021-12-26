class BaseError extends Error {
  constructor(name: string, description: string, public statusCode: number, public metadata?: Record<string, unknown>) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.metadata = metadata;
    Error.captureStackTrace(this);
  }
}

export default BaseError;
