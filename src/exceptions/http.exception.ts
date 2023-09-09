export class HttpError extends Error {
  code: number;

  constructor(message: string, code = 500) {
    super(message);
    this.code = code;
  }
}

export class ValidationError extends Error {
  code = 422;
  errors: unknown = null;

  constructor(error: unknown) {
    super('');
    this.errors = error;
  }
}
