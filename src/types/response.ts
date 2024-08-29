import type { FileBase } from './webhook.js';

export interface ResOk<T> {
  ok: true;
  result: T;
}

export interface TelegramError {
  ok: false;
  error_code: number;
  description: string;
}

export type TelegramResponse<T> = TelegramError | ResOk<T>;

export type WebhookResponse = TelegramError | (ResOk<true> & { description: string });
export type CommandResponse = TelegramError | ResOk<true>;
export interface DownloadRes extends FileBase {
  file_path: string;
}
