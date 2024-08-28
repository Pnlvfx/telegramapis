import type { ChatId, SendPhotoOptions, SendVideoOptions } from '../types/index.js';
import type { ResOk, TelegramResponse } from '../types/response.js';
import type { Message } from '../types/webhook.js';
import FormData from 'form-data';
import https from 'node:https';
import { Stream } from 'node:stream';
import fs from 'node:fs';
import { telegramHeaders } from './config.js';

export const sendMedia = async (
  type: 'photo' | 'video',
  input: Stream | string,
  req_options: https.RequestOptions,
  chatId: ChatId,
  options?: SendPhotoOptions | SendVideoOptions,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const form = new FormData();
  const query = new URLSearchParams();
  if (input instanceof Stream || !input.startsWith('http')) {
    form.append('chat_id', chatId);
    form.append(type, input instanceof Stream ? input : fs.createReadStream(input));
    req_options.headers = form.getHeaders();
  } else {
    query.append(type, input);
    query.append('chat_id', chatId.toString());
  }

  if (options) {
    for (const [key, value] of Object.entries(options)) {
      if (value === undefined) continue;
      const parsed = typeof value === 'string' ? value : JSON.stringify(value);
      if (query.toString()) {
        query.append(key, parsed);
      } else {
        form.append(key, parsed);
      }
    }
  }

  if (query.toString()) {
    req_options.headers = {
      ...telegramHeaders,
      'Content-Length': Buffer.byteLength(query.toString()),
    };
  }

  return new Promise<ResOk<Message>>((resolve, reject) => {
    const req = https.request(req_options, (res) => {
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
    if (query.toString()) req.write(query.toString());
    else form.pipe(req);
  });
};
