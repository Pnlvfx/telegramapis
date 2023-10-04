import type { Stream } from 'node:stream';
import fs from 'node:fs';
import https from 'node:https';
import type { BotCommand, METHODPROPS, SendMessageOptions, SendPhotoOptions, SendVideoOptions } from './types/index.js';
import { sendMedia } from './lib/media.js';
import type { CommandResponse, DownloadRes, TelegramResponse, WebhookResponse } from './types/response.js';
import type { Message } from './types/webhook.js';
import path from 'node:path';
import { telegramError, telegramHeaders } from './lib/config.js';

const telegramapis = (token: string) => {
  const buildUrl = (METHOD: METHODPROPS, query?: string) => {
    const base_url = 'https://api.telegram.org';
    let url = `${base_url}/bot${token}/${METHOD}`;
    if (query) {
      url = `${url}?${query}`;
    }
    return url;
  };
  return {
    sendMessage: async (chatId: number, text: string, options?: SendMessageOptions) => {
      const query = new URLSearchParams({ chat_id: chatId.toString(), text: encodeURIComponent(text) });
      if (options) {
        for (const [key, value] of Object.entries(options)) {
          if (value === undefined) continue;
          const parsed = typeof value === 'string' ? value : JSON.stringify(value);
          query.append(key, encodeURIComponent(parsed));
        }
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
    sendPhoto: (chatId: number, photo: string | Stream, options?: SendPhotoOptions) => {
      const req_options = {
        host: 'api.telegram.org',
        path: `/bot${token}/sendPhoto`,
        method: 'POST',
        headers: {},
      };
      return sendMedia('photo', photo, req_options, chatId, options);
    },
    sendVideo: (chatId: number, video: string | Stream, options?: SendVideoOptions) => {
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
          res.on('error', (err) => {
            reject(err);
          });
          res.on('end', () => {
            const response: TelegramResponse<DownloadRes> = JSON.parse(data);
            if (!response.ok) return reject(response);
            const filePath = response.result.file_path;
            const mediaUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
            const extension = filePath.split('.').pop()?.toLowerCase();
            if (!extension) return reject('Telegram error: Missing media extension!');
            const filename = path.join(downloadDir, `${response.result.file_unique_id}.${extension}`);
            https.get(mediaUrl, (response) => {
              console.log(2, response);
              response.pipe(fs.createWriteStream(filename));
              response.on('end', () => {
                console.log(filename);
                resolve(filename);
              });
            });
          });
        });
      });
    },
    deleteMessage: async (chatId: number, message_id: string | number) => {
      const url = buildUrl('deleteMessage', `chat_id=${chatId}&message_id=${message_id}`);
      console.log(url);
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
