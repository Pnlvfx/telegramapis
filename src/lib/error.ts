import type { ResponseParameters, TelegramError as TelegramErrorType } from '../types/response.js';

class TelegramError extends Error {
  error_code: number;
  parameters?: ResponseParameters;

  constructor(message: string, error_code: number, parameters: ResponseParameters | undefined) {
    super(message);
    this.error_code = error_code;
    this.parameters = parameters;
    this.name = 'TelegramError';
    Object.setPrototypeOf(this, TelegramError.prototype);
  }
}

export const telegramError = ({ description, error_code, parameters }: Omit<TelegramErrorType, 'ok'>) => {
  return new TelegramError(description, error_code, parameters);
};

export const isTelegramError = (err: unknown) => {
  return err instanceof TelegramError;
};
