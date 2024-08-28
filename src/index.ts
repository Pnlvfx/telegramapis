/* eslint-disable sonarjs/no-nested-functions */
import type { Stream } from 'node:stream';
import type { CommandResponse, DownloadRes, TelegramResponse, WebhookResponse } from './types/response.js';
import type { Message } from './types/webhook.js';
import type { BotCommand, ChatId, Endpoint, SendMessageOptions, SendPhotoOptions, SendVideoOptions } from './types/index.js';
import fs from 'node:fs';
import https from 'node:https';
import { sendMedia } from './lib/media.js';
import path from 'node:path';
import { telegramError, telegramHeaders } from './lib/config.js';

const base_url = 'https://api.telegram.org';

const telegramapis = (token: string) => {
  const buildUrl = (METHOD: Endpoint, query?: string) => {
    const url = `${base_url}/bot${token}/${METHOD}`;
    return query ? `${url}?${query}` : url;
  };
  return {
    sendMessage: async (chatId: ChatId, text: string, options?: SendMessageOptions) => {
      const query = new URLSearchParams({ chat_id: chatId.toString(), text });
      if (options) {
        Object.entries(options).map(([key, value]) => {
          if (!value) return;
          const parsed = typeof value === 'string' ? value : JSON.stringify(value);
          query.append(key, parsed);
        });
      }
      const url = buildUrl('sendMessage', query.toString());
      const res = await fetch(url, {
        method: 'POST',
        headers: telegramHeaders,
      });
      const data: TelegramResponse<Message> = await res.json();
      if (!data.ok) throw telegramError(data);
      return data;
    },
    sendPhoto: (chatId: ChatId, photo: string | Stream, options?: SendPhotoOptions) => {
      const req_options = {
        host: 'api.telegram.org',
        path: `/bot${token}/sendPhoto`,
        method: 'POST',
        headers: {},
      };
      return sendMedia('photo', photo, req_options, chatId, options);
    },
    sendVideo: (chatId: ChatId, video: string | Stream, options?: SendVideoOptions) => {
      const req_options = {
        host: 'api.telegram.org',
        path: `/bot${token}/sendVideo`,
        method: 'POST',
        headers: {},
      };
      return sendMedia('video', video, req_options, chatId, options);
    },
    setWebHook: async (url: string): Promise<WebhookResponse> => {
      const _url = buildUrl('setWebhook', `url=${url}`);
      const res = await fetch(_url, {
        method: 'POST',
        headers: telegramHeaders,
      });
      const data: WebhookResponse = await res.json();
      if (!data.ok) throw telegramError(data);
      return data;
    },
    deleteWebHook: async (): Promise<WebhookResponse> => {
      const _url = buildUrl('deleteWebhook');
      const res = await fetch(_url, {
        method: 'POST',
        headers: telegramHeaders,
      });
      const data: WebhookResponse = await res.json();
      if (!data.ok) throw telegramError(data);
      return data;
    },
    setMyCommands: async (commands: BotCommand[]) => {
      commands.map((_) => {
        if (!_.command.match('/')) _.command = '/' + _.command;
      });
      const url = buildUrl('setMyCommands');
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ commands }),
      });
      const data: CommandResponse = await res.json();
      if (!data.ok) throw telegramError(data);
      return data;
    },
    downloadFile: (fileId: string, downloadDir: string) => {
      return new Promise<string>((resolve, reject) => {
        const url = buildUrl('getFile', `file_id=${fileId}`);
        https.get(url, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('error', reject);
          res.on('end', () => {
            const response: TelegramResponse<DownloadRes> = JSON.parse(data);
            if (!response.ok) return reject(response);
            const filePath = response.result.file_path;
            const mediaUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
            const extension = filePath.split('.').pop()?.toLowerCase();
            if (!extension) return reject('Telegram error: Missing media extension!');
            const filename = path.join(downloadDir, `${response.result.file_unique_id}.${extension}`);
            https.get(mediaUrl, (response) => {
              response.pipe(fs.createWriteStream(filename));
              response.on('end', () => resolve(filename));
            });
          });
        });
      });
    },
    deleteMessage: async (chatId: ChatId, message_id: string | number) => {
      const url = buildUrl('deleteMessage', `chat_id=${chatId}&message_id=${message_id}`);
      const res = await fetch(url, {
        method: 'DELETE',
        headers: telegramHeaders,
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    },
    getUpdates: async () => {
      const url = buildUrl('getUpdates');
      const res = await fetch(url, {
        method: 'POST',
        headers: telegramHeaders,
      });
      const data = await res.json();
      if (!res.ok) throw telegramError(data);
    },
  };
};

export default telegramapis;

export type {
  BotCommand,
  ChatId,
  Endpoint,
  InlineKeyboardMarkup,
  PollType,
  SendMessageOptions,
  SendPhotoOptions,
  SendVideoOptions,
} from './types/index.js';

export type { CommandResponse, DownloadRes, OkResponse, ResOk, TelegramError, TelegramResponse, WebhookResponse } from './types/response.js';
export type { CallbackQuery, FileBase, Message, Update } from './types/webhook.js';
