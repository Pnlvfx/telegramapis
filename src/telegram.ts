/* eslint-disable unicorn/no-null */
import { messageSchema } from './types/webhook.ts';
import { createResponseSchema, createArrayResponseSchema, booleanResultSchema, webhookResponseSchema } from './types/response.ts';
import { TelegramError } from './errors/telegram-error.ts';
import {
  sendMessageOptionsSchema,
  editMessageTextOptionsSchema,
  botCommandSchema,
  type BotCommand,
  type ChatId,
  type SendDocumentOptions,
  type SendMessageOptions,
  type SendPhotoOptions,
  type SendVideoOptions,
  type EditMessageTextOptions,
} from './types/params.ts';
import { type InputMedia, type InputMediaType, type SendMediaGroupOptions } from './types/media-group.ts';
import { addMediaOptions, getMedia } from './lib/media.ts';
import { baseHeaders } from './lib/config.ts';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getEntries } from '@goatjs/core/object';
import * as z from 'zod';
import { fetchError } from '@goatjs/core/errors/fetch';

type MediaEndpoint = 'sendPhoto' | 'sendVideo' | 'sendMediaGroup' | 'sendDocument';

export interface TelegramOptions {
  debug?: boolean;
  skipValidation?: boolean;
}

interface RequestOptions {
  body?: BodyInit;
  headers?: Headers;
}

export const createTelegramClient = (token: string, { debug, skipValidation = true }: TelegramOptions = {}) => {
  const baseUrl = `https://api.telegram.org/bot${token}`;

  const request = async <T extends z.ZodType>(endpoint: `/${string}`, schema: T, { body, headers }: RequestOptions = {}): Promise<z.infer<T>> => {
    const url = `${baseUrl}${endpoint}`;
    const requestHeaders = headers ?? (body instanceof FormData ? undefined : baseHeaders);
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('Sending request to', url, 'headers:', requestHeaders, body);
    }
    const res = await fetch(url, { headers: requestHeaders, method: 'POST', body });
    const json = (await res.json()) as z.infer<T>;

    // Check Telegram API response status
    if (typeof json === 'object' && json != null && 'ok' in json && json.ok === false) {
      const errorResponse = json as unknown as { ok: false; error_code: number; description: string; parameters?: { retry_after?: number } };
      throw new TelegramError(errorResponse.error_code, errorResponse.description, errorResponse.parameters);
    }

    // If HTTP status is not ok and it's not a Telegram error format, throw fetch error
    if (!res.ok) throw fetchError(res.statusText, { status: res.status });

    if (skipValidation) return json;
    const response = await schema.parseAsync(json);
    return response;
  };

  const sendMedia = async (endpoint: MediaEndpoint, headers?: Headers, form?: FormData, query?: URLSearchParams, schema?: z.ZodType) => {
    if (!form && !query) throw new Error('One between query and form has to be provided.');
    const responseSchema = schema ?? createResponseSchema(messageSchema);
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
          if (input.media instanceof Blob) {
            form.append(i.toString(), input.media);
          } else {
            const fileBuffer = await fs.readFile(input.media);
            const filename = path.basename(input.media);
            const blob = new Blob([new Uint8Array(fileBuffer)]);
            form.append(i.toString(), blob, filename);
          }
          payload.media = attachName;
        }
        inputMedia.push(payload);
      }
      form.append('media', JSON.stringify(inputMedia));
      addMediaOptions(form, options);
      const arrayResponseSchema = createArrayResponseSchema(messageSchema);
      return sendMedia('sendMediaGroup', undefined, form, undefined, arrayResponseSchema);
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
    editMessageText: async (chatId: ChatId, messageId: number, text: string, options: EditMessageTextOptions = {}) => {
      const validatedOptions = await editMessageTextOptionsSchema.parseAsync(options);
      const query = new URLSearchParams({
        chat_id: chatId.toString(),
        message_id: messageId.toString(),
        text,
      });
      if (validatedOptions.message_thread_id !== undefined) {
        query.append('message_thread_id', validatedOptions.message_thread_id.toString());
      }
      if (validatedOptions.parse_mode !== undefined) {
        query.append('parse_mode', validatedOptions.parse_mode);
      }
      if (validatedOptions.entities !== undefined) {
        query.append('entities', JSON.stringify(validatedOptions.entities));
      }
      if (validatedOptions.disable_web_page_preview !== undefined) {
        query.append('disable_web_page_preview', validatedOptions.disable_web_page_preview.toString());
      }
      if (validatedOptions.reply_markup !== undefined) {
        query.append('reply_markup', JSON.stringify(validatedOptions.reply_markup));
      }
      return request(`/editMessageText?${query.toString()}`, createResponseSchema(messageSchema));
    },
  };
};

export { isTelegramError, TelegramError } from './errors/telegram-error.ts';
