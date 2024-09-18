import type { ChatId, SendPhotoOptions, SendVideoOptions } from '../types/index.js';
import type { ResOk, TelegramResponse } from '../types/response.js';
import type { Message } from '../types/webhook.js';
import FormData from 'form-data';
import https, { type RequestOptions } from 'node:https';
import { Stream } from 'node:stream';
import fs from 'node:fs';
import { headers } from './config.js';
import { getEntries } from 'coraline';

type MediaOptions = SendPhotoOptions | SendVideoOptions;

export type InputMediaType = string | Stream;

export const addMediaOptions = (collector: FormData | URLSearchParams, options?: MediaOptions) => {
  if (!options) return;
  for (const [key, value] of getEntries(options)) {
    if (value === undefined) continue;
    const parsed = typeof value === 'string' ? value : JSON.stringify(value);
    collector.append(key, parsed);
  }
};

export const getMedia = (type: 'photo' | 'video', input: InputMediaType, reqOptions: RequestOptions, chatId: ChatId, options?: MediaOptions) => {
  let form;
  let query;
  if (input instanceof Stream || !input.startsWith('http')) {
    form = new FormData();
    form.append('chat_id', chatId);
    form.append(type, input instanceof Stream ? input : fs.createReadStream(input));
    reqOptions.headers = form.getHeaders();
    addMediaOptions(form, options);
  } else {
    query = new URLSearchParams();
    query.append(type, input);
    query.append('chat_id', chatId.toString());
    addMediaOptions(query, options);
    reqOptions.headers = {
      ...headers,
      'Content-Length': Buffer.byteLength(query.toString()),
    };
  }
  return { form, query, reqOptions };
};

export const sendMedia = (options: RequestOptions, form?: FormData, query?: URLSearchParams) => {
  if (!form && !query) throw new Error('One between query and form has to be provided.');
  return new Promise<ResOk<Message>>((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      let response = '';
      res.on('data', (chunk: Buffer) => {
        response += chunk.toString();
      });
      res.on('end', () => {
        const parsedResponse = JSON.parse(response) as TelegramResponse<Message>;
        if (parsedResponse.ok) resolve(parsedResponse);
        else reject(new Error(parsedResponse.description));
      });
    });
    req.on('error', reject);
    if (query) req.write(query.toString());
    else if (form) form.pipe(req);
  });
};
