import type { TelegramError } from '../types/response.js';

export const telegramError = (err: TelegramError) => `${err.error_code.toString()}: ${err.description}`;

export const telegramHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
