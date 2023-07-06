import { FileBase } from './webhook';

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

export interface Ok {
  ok: true;
  result: true;
}

export type WebhookResponse = TelegramError | (Ok & { description: string });
export type CommandResponse = TelegramError | Ok;
export interface DownloadRes extends FileBase {
  file_path: string;
}
