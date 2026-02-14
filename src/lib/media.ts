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

export const getMimeType = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return mimeTypes[ext] || 'application/octet-stream';
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
      const mimeType = getMimeType(filename);
      const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
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
