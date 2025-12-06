import type { ChatId, SendPhotoOptions, SendVideoOptions } from '../types/telegram.js';
import fs from 'node:fs/promises';
import { headers as HEADERS } from './config.js';
import { getEntries } from '@goatjs/core/object';

type MediaOptions = SendPhotoOptions | SendVideoOptions;

export type InputMediaType = string | Blob;

export const addMediaOptions = (collector: FormData | URLSearchParams, options: MediaOptions = {}) => {
  for (const [key, value] of getEntries(options)) {
    if (value === undefined) continue;
    const parsed = typeof value === 'string' ? value : JSON.stringify(value);
    collector.append(key, parsed);
  }
};

export const getMedia = async (type: 'photo' | 'video' | 'document', input: InputMediaType, chatId: ChatId, options: MediaOptions = {}) => {
  let form;
  let query;
  let headers: HeadersInit | undefined;
  if (input instanceof Blob || !input.startsWith('http')) {
    form = new FormData();
    form.append('chat_id', chatId.toString());
    if (input instanceof Blob) {
      form.append(type, input);
    } else {
      const fileBuffer = await fs.readFile(input);
      const blob = new Blob([new Uint8Array(fileBuffer)]);
      form.append(type, blob, input);
    }

    addMediaOptions(form, options);
  } else {
    query = new URLSearchParams();
    query.append(type, input);
    query.append('chat_id', chatId.toString());
    addMediaOptions(query, options);
    headers = {
      ...HEADERS,
      'content-length': Buffer.byteLength(query.toString()).toString(),
    };
  }
  return { form, query, headers };
};
