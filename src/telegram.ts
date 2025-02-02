import type { Message } from './types/webhook.js';
import type { CommandResponse, TelegramResponse, WebhookResponse } from './types/response.js';
import type { BotCommand, ChatId, SendMessageOptions, SendPhotoOptions, SendVideoOptions } from './types/index.js';
import type { InputMedia, SendMediaGroupOptions } from './types/media-group.js';
import { addMediaOptions, getMedia, InputMediaType } from './lib/media.js';
import { telegramError, headers } from './lib/config.js';
import fs from 'node:fs/promises';
import { getEntries } from '@goatjs/core/typed-object';

const BASE_URL = 'https://api.telegram.org';

type MediaEndpoint = 'sendPhoto' | 'sendVideo' | 'sendMediaGroup';

export const telegramapis = (token: string) => {
  const buildUrl = (METHOD: string, query?: URLSearchParams) => {
    const url = `${BASE_URL}/bot${token}/${METHOD}`;
    return query ? `${url}?${query.toString()}` : url;
  };

  const sendMedia = async (endpoint: MediaEndpoint, headers?: HeadersInit, form?: FormData, query?: URLSearchParams) => {
    if (!form && !query) throw new Error('One between query and form has to be provided.');
    const res = await fetch(buildUrl(endpoint, query), { method: 'POST', body: form, headers });
    if (!res.ok) throw new Error(`${res.status.toString()}: ${res.statusText}`);
    return res.json() as Promise<TelegramResponse<Message>>;
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
      const url = buildUrl('sendMessage', query);
      const res = await fetch(url, {
        method: 'POST',
        headers,
      });
      const data = (await res.json()) as TelegramResponse<Message>;
      if (!data.ok) throw new Error(telegramError(data));
      return data;
    },
    sendPhoto: async (chatId: ChatId, photo: InputMediaType, options?: SendPhotoOptions) => {
      const { form, query, headers } = await getMedia('photo', photo, chatId, options);
      return sendMedia('sendPhoto', headers, form, query);
    },
    sendVideo: async (chatId: ChatId, video: InputMediaType, options?: SendVideoOptions) => {
      const { form, query, headers } = await getMedia('video', video, chatId, options);
      return sendMedia('sendVideo', headers, form, query);
    },
    sendMediaGroup: async (chatId: ChatId, media: readonly InputMedia[], options?: SendMediaGroupOptions) => {
      const inputMedia = [];
      const form = new FormData();
      form.append('chat_id', chatId.toString());
      for (const [i, input] of media.entries()) {
        const payload = { ...input };
        if (input.media instanceof Blob || !input.media.startsWith('http')) {
          const attachName = `attach://${i.toString()}`;
          form.append(i.toString(), input.media instanceof Blob ? input.media : new Blob([await fs.readFile(input.media)]));
          payload.media = attachName;
        }
        inputMedia.push(payload);
      }
      form.append('media', JSON.stringify(inputMedia));
      if (options) {
        addMediaOptions(form, options);
      }
      return sendMedia('sendMediaGroup', {}, form);
    },
    setWebHook: async (url: string): Promise<WebhookResponse> => {
      const _url = buildUrl('setWebhook', new URLSearchParams({ url }));
      const res = await fetch(_url, {
        method: 'POST',
        headers,
      });
      const data = (await res.json()) as WebhookResponse;
      if (!data.ok) throw new Error(telegramError(data));
      return data;
    },
    deleteWebHook: async (): Promise<WebhookResponse> => {
      const _url = buildUrl('deleteWebhook');
      const res = await fetch(_url, {
        method: 'POST',
        headers,
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
    deleteMessage: async (chatId: ChatId, message_id: string | number) => {
      const q = new URLSearchParams({ chat_id: chatId.toString(), message_id: message_id.toString() });
      const url = buildUrl('deleteMessage', q);
      const res = await fetch(url, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error(`${res.status.toString()} ${res.statusText}`);
    },
  };
};

export type TelegramApi = ReturnType<typeof telegramapis>;

export type {
  BotCommand,
  ChatId,
  InlineKeyboardMarkup,
  PollType,
  SendMessageOptions,
  SendPhotoOptions,
  SendVideoOptions,
  ParseMode,
} from './types/index.js';
export type { CommandResponse, TelegramError, ResOk, TelegramResponse, WebhookResponse } from './types/response.js';
export type { FileBase, Message, Update, CallbackQuery, MessageEntity, User } from './types/webhook.js';
export type { InputMedia, SendMediaGroupOptions } from './types/media-group.js';
export type { InputMediaType } from './lib/media.js';
