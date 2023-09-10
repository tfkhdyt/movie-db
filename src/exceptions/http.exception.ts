import { Issues } from 'valibot';

export class HttpError extends Error {
  code: number;

  constructor(message: string, code = 500) {
    super(message);
    this.code = code;
  }
}

export class ValidationError extends Error {
  code = 422;
  errors: string[];

  constructor(error: Issues) {
    super('');
    this.errors = error.map((err) => err.message);
  }
}
