/* eslint-disable sonarjs/no-nested-functions */
import type { Message } from './types/webhook.js';
import type { CommandResponse, DownloadRes, TelegramResponse, WebhookResponse } from './types/response.js';
import type { BotCommand, ChatId, SendMessageOptions, SendPhotoOptions, SendVideoOptions } from './types/index.js';
import type { InputMedia, SendMediaGroupOptions } from './types/media-group.js';
import fs from 'node:fs';
import https from 'node:https';
import { addMediaOptions, getMedia, InputMediaType, sendMedia } from './lib/media.js';
import path from 'node:path';
import { telegramError, telegramHeaders } from './lib/config.js';
import { getEntries } from 'coraline';
import FormData from 'form-data';
import { Stream } from 'node:stream';

const base_url = 'https://api.telegram.org';

const telegramapis = (token: string) => {
  const buildUrl = (METHOD: string, query?: string) => {
    const url = `${base_url}/bot${token}/${METHOD}`;
    return query ? `${url}?${query}` : url;
  };
  return {
    sendMessage: async (chatId: ChatId, text: string, options?: SendMessageOptions) => {
      const query = new URLSearchParams({ chat_id: chatId.toString(), text });
      if (options) {
        for (const [key, value] of getEntries(options)) {
          if (!value) continue;
          const parsed = typeof value === 'string' ? value : JSON.stringify(value);
          query.append(key, parsed);
        }
      }
      const url = buildUrl('sendMessage', query.toString());
      const res = await fetch(url, {
        method: 'POST',
        headers: telegramHeaders,
      });
      const data = (await res.json()) as TelegramResponse<Message>;
      if (!data.ok) throw new Error(telegramError(data));
      return data;
    },
    sendPhoto: (chatId: ChatId, photo: InputMediaType, options?: SendPhotoOptions) => {
      const req_options = {
        host: 'api.telegram.org',
        path: `/bot${token}/sendPhoto`,
        method: 'POST',
      };
      const { form, query, reqOptions } = getMedia('photo', photo, req_options, chatId, options);
      return sendMedia(reqOptions, form, query);
    },
    sendVideo: (chatId: ChatId, video: InputMediaType, options?: SendVideoOptions) => {
      const req_options = {
        host: 'api.telegram.org',
        path: `/bot${token}/sendVideo`,
        method: 'POST',
      };
      const { form, query, reqOptions } = getMedia('video', video, req_options, chatId, options);
      return sendMedia(reqOptions, form, query);
    },
    sendMediaGroup: (chatId: ChatId, media: readonly InputMedia[], options?: SendMediaGroupOptions) => {
      const req_options = {
        host: 'api.telegram.org',
        path: `/bot${token}/sendMediaGroup`,
        method: 'POST',
        headers: {},
      };
      const inputMedia = [];
      const form = new FormData();
      form.append('chat_id', chatId.toString());
      for (const [i, input] of media.entries()) {
        const payload = { ...input };
        if (input.media instanceof Stream || !input.media.startsWith('http')) {
          const attachName = `attach://${i.toString()}`;
          form.append(i.toString(), input.media instanceof Stream ? input.media : fs.createReadStream(input.media));
          payload.media = attachName;
        }
        inputMedia.push(payload);
      }
      form.append('media', JSON.stringify(inputMedia));
      if (options) {
        addMediaOptions(form, options);
      }
      req_options.headers = form.getHeaders();
      return sendMedia(req_options, form);
    },
    setWebHook: async (url: string): Promise<WebhookResponse> => {
      const _url = buildUrl('setWebhook', `url=${url}`);
      const res = await fetch(_url, {
        method: 'POST',
        headers: telegramHeaders,
      });
      const data = (await res.json()) as WebhookResponse;
      if (!data.ok) throw new Error(telegramError(data));
      return data;
    },
    deleteWebHook: async (): Promise<WebhookResponse> => {
      const _url = buildUrl('deleteWebhook');
      const res = await fetch(_url, {
        method: 'POST',
        headers: telegramHeaders,
      });
      const data = (await res.json()) as WebhookResponse;
      if (!data.ok) throw new Error(telegramError(data));
      return data;
    },
    setMyCommands: async (commands: BotCommand[]) => {
      for (const a of commands) {
        if (!a.command.includes('/')) {
          a.command = '/' + a.command;
        }
      }
      const url = buildUrl('setMyCommands');
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ commands }),
      });
      const data = (await res.json()) as CommandResponse;
      if (!data.ok) throw new Error(telegramError(data));
      return data;
    },
    downloadFile: (fileId: string, downloadDir: string) => {
      return new Promise<string>((resolve, reject) => {
        const url = buildUrl('getFile', `file_id=${fileId}`);
        https.get(url, (res) => {
          let data = '';
          res.on('data', (chunk: Buffer) => {
            data += chunk.toString();
          });
          res.on('error', reject);
          res.on('end', () => {
            const response = JSON.parse(data) as TelegramResponse<DownloadRes>;
            if (!response.ok) {
              reject(new Error(response.description));
              return;
            }
            const filePath = response.result.file_path;
            const mediaUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
            const extension = filePath.split('.').pop()?.toLowerCase();
            if (!extension) {
              reject(new Error('Telegram error: Missing media extension!'));
              return;
            }
            const filename = path.join(downloadDir, `${response.result.file_unique_id}.${extension}`);
            https.get(mediaUrl, (response) => {
              response.pipe(fs.createWriteStream(filename));
              response.on('end', () => {
                resolve(filename);
              });
            });
          });
        });
      });
    },
    deleteMessage: async (chatId: ChatId, message_id: string | number) => {
      const url = buildUrl('deleteMessage', `chat_id=${chatId.toString()}&message_id=${message_id.toString()}`);
      const res = await fetch(url, {
        method: 'DELETE',
        headers: telegramHeaders,
      });
      if (!res.ok) throw new Error(`${res.status.toString()} ${res.statusText}`);
    },
  };
};

export default telegramapis;

export type { BotCommand, ChatId, InlineKeyboardMarkup, PollType, SendMessageOptions, SendPhotoOptions, SendVideoOptions } from './types/index.js';
export type { CommandResponse, DownloadRes, TelegramError, ResOk, TelegramResponse, WebhookResponse } from './types/response.js';
export type { FileBase, Message, Update, CallbackQuery } from './types/webhook.js';
