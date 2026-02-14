import type { InputMediaType } from '../types/media-group.ts';
import type { ChatId, SendPhotoOptions, SendVideoOptions } from '../types/params.ts';
import { getEntries } from '@goatjs/core/object';
import fs from 'node:fs/promises';
import path from 'node:path';
import { baseHeaders } from './config.ts';

type MediaOptions = SendPhotoOptions | SendVideoOptions;

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
  let headers: Headers | undefined;
  if (input instanceof Blob || !input.startsWith('http')) {
    form = new FormData();
    form.append('chat_id', chatId.toString());
    if (input instanceof Blob) {
      form.append(type, input);
    } else {
      const fileBuffer = await fs.readFile(input);
      const filename = path.basename(input);
      const blob = new Blob([new Uint8Array(fileBuffer)]);
      form.append(type, blob, filename);
    }

    addMediaOptions(form, options);
    // Don't set headers for FormData - let fetch set the correct multipart/form-data boundary
    headers = undefined;
  } else {
    query = new URLSearchParams();
    query.append(type, input);
    query.append('chat_id', chatId.toString());
    addMediaOptions(query, options);
    headers = new Headers(baseHeaders);
    headers.append('content-length', Buffer.byteLength(query.toString()).toString());
  }

  return { form, query, headers };
};
