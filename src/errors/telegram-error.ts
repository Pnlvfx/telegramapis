import type { TelegramErrorParameters } from '../types/response.ts';

export class TelegramError extends Error {
  public readonly error_code: number;
  public readonly description: string;
  public readonly parameters?: TelegramErrorParameters;

  constructor(error_code: number, description: string, parameters?: TelegramErrorParameters) {
    super(description);
    this.name = 'TelegramError';
    this.error_code = error_code;
    this.description = description;
    this.parameters = parameters;
  }
}

export function isTelegramError(error: unknown): error is TelegramError {
  return error instanceof TelegramError;
}
