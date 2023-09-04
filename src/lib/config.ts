import { TelegramError } from '../types/response.js';

export const telegramError = (err: TelegramError) => {
  throw new Error(`Error code: ${err.error_code}, ${err.description}`);
};

export const telegramHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
