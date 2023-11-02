import { FileBase } from './webhook.js';

export type TelegramResponse<T> = TelegramError | ResOk<T>;

export interface TelegramError {
  ok: false;
  error_code: number;
  description: string;
}

export interface ResOk<T> {
  ok: true;
  result: T;
}

export interface OkResponse {
  ok: true;
  result: true;
}

export type WebhookResponse = TelegramError | (OkResponse & { description: string });
export type CommandResponse = TelegramError | OkResponse;
export interface DownloadRes extends FileBase {
  file_path: string;
}
