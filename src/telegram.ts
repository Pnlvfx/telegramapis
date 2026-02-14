import { messageSchema } from './types/webhook.ts';
import { createResponseSchema, booleanResultSchema, webhookResponseSchema } from './types/response.ts';
import {
  sendMessageOptionsSchema,
  botCommandSchema,
  type BotCommand,
  type ChatId,
  type SendDocumentOptions,
  type SendMessageOptions,
  type SendPhotoOptions,
  type SendVideoOptions,
} from './types/params.ts';
import { type InputMedia, type InputMediaType, type SendMediaGroupOptions } from './types/media-group.ts';
import { addMediaOptions, getMedia } from './lib/media.ts';
import { baseHeaders } from './lib/config.ts';
import fs from 'node:fs/promises';
import { getEntries } from '@goatjs/core/object';
import * as z from 'zod';
import { fetchError } from '@goatjs/core/errors/fetch';

type MediaEndpoint = 'sendPhoto' | 'sendVideo' | 'sendMediaGroup' | 'sendDocument';

export interface TelegramOptions {
  debug?: boolean;
}

interface RequestOptions {
  body?: BodyInit;
  headers?: Headers;
}

export const createTelegramClient = (token: string, { debug }: TelegramOptions = {}) => {
  const baseUrl = `https://api.telegram.org/bot${token}`;

  const request = async <T extends z.ZodType>(endpoint: `/${string}`, schema: T, { body, headers = baseHeaders }: RequestOptions = {}) => {
    const url = `${baseUrl}${endpoint}`;
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('Sending request to', url, 'headers:', headers, body);
    }
    const res = await fetch(url, { headers: headers, method: 'POST', body });
    if (!res.ok) throw fetchError(res.statusText, { status: res.status });
    const response = await schema.parseAsync(await res.json());
    return response;
  };

  const sendMedia = async (endpoint: MediaEndpoint, headers?: Headers, form?: FormData, query?: URLSearchParams) => {
    if (!form && !query) throw new Error('One between query and form has to be provided.');
    const responseSchema = createResponseSchema(messageSchema);
    return request(query ? `/${endpoint}?${query.toString()}` : `/${endpoint}`, responseSchema, { body: form, headers });
  };

  return {
    sendMessage: async (chatId: ChatId, text: string, o: SendMessageOptions = {}) => {
      const options = await sendMessageOptionsSchema.parseAsync(o);
      const query = new URLSearchParams({ chat_id: chatId.toString(), text });
      for (const [key, value] of getEntries(options)) {
        if (value === undefined) continue;
        const parsed = typeof value === 'string' ? value : JSON.stringify(value);
        query.append(key, parsed);
      }
      const responseSchema = createResponseSchema(messageSchema);
      return request(`/sendMessage?${query.toString()}`, responseSchema);
    },
    sendDocument: async (chatId: ChatId, document: InputMediaType, options: SendDocumentOptions = {}) => {
      const { form, query, headers } = await getMedia('document', document, chatId, options);
      return sendMedia('sendDocument', headers, form, query);
    },
    sendPhoto: async (chatId: ChatId, photo: InputMediaType, options: SendPhotoOptions = {}) => {
      const { form, query, headers } = await getMedia('photo', photo, chatId, options);
      return sendMedia('sendPhoto', headers, form, query);
    },
    sendVideo: async (chatId: ChatId, video: InputMediaType, options: SendVideoOptions = {}) => {
      const { form, query, headers } = await getMedia('video', video, chatId, options);
      return sendMedia('sendVideo', headers, form, query);
    },
    sendMediaGroup: async (chatId: ChatId, media: readonly InputMedia[], options: SendMediaGroupOptions = {}) => {
      const inputMedia = [];
      const form = new FormData();
      form.append('chat_id', chatId.toString());
      for (const [i, input] of media.entries()) {
        const payload = { ...input };
        if (input.media instanceof Blob || !input.media.startsWith('http')) {
          const attachName = `attach://${i.toString()}`;
          form.append(i.toString(), input.media instanceof Blob ? input.media : new Blob([new Uint8Array(await fs.readFile(input.media))]));
          payload.media = attachName;
        }
        inputMedia.push(payload);
      }
      form.append('media', JSON.stringify(inputMedia));
      addMediaOptions(form, options);
      return sendMedia('sendMediaGroup', undefined, form);
    },
    setWebHook: async (url: string) => {
      const query = new URLSearchParams({ url });
      return request(`/setWebhook?${query.toString()}`, webhookResponseSchema);
    },
    deleteWebHook: async () => {
      return request('/deleteWebhook', webhookResponseSchema);
    },
    setMyCommands: async (commands: BotCommand[]) => {
      const validatedCommands = await z.array(botCommandSchema).parseAsync(commands);
      for (const cmd of validatedCommands) {
        if (!cmd.command.includes('/')) {
          cmd.command = '/' + cmd.command;
        }
      }
      const body = JSON.stringify({ commands: validatedCommands });
      const headers = new Headers({ 'content-type': 'application/json' });
      return request('/setMyCommands', booleanResultSchema, { body, headers });
    },
    deleteMessage: async (chatId: ChatId, message_id: string | number) => {
      const query = new URLSearchParams({ chat_id: chatId.toString(), message_id: message_id.toString() });
      return request(`/deleteMessage?${query.toString()}`, booleanResultSchema, { headers: baseHeaders });
    },
  };
};
