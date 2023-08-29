/* eslint-disable sonarjs/cognitive-complexity */
import FormData from 'form-data';
import https from 'node:https';
import { SendPhotoOptions, SendVideoOptions } from '../types';
import { Stream } from 'node:stream';
import fs from 'node:fs';
import { ResOk, TelegramResponse } from '../types/response';
import { Message } from '../types/webhook';
import { telegramHeaders } from './config.js';

export const sendMedia = async (
  type: 'photo' | 'video',
  input: Stream | string,
  req_options: https.RequestOptions,
  chatId: string | number,
  options?: SendPhotoOptions | SendVideoOptions,
) => {
  const form = new FormData();
  let data = '';
  if (input instanceof Stream || !input.startsWith('http')) {
    form.append('chat_id', chatId);
    form.append(type, input instanceof Stream ? input : fs.createReadStream(input));
    req_options.headers = form.getHeaders();
  } else {
    data = `${type}=${input}&chat_id=${chatId}`;
    req_options.headers = {
      ...telegramHeaders,
      'Content-Length': Buffer.byteLength(data),
    };
  }

  if (options) {
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined) {
        const parsed = typeof value === 'string' ? value : JSON.stringify(value);
        if (data) {
          data += `&${key}=${parsed}`;
        } else {
          form.append(key, parsed);
        }
      }
    }
  }

  return new Promise<ResOk<Message>>((resolve, reject) => {
    const req = https.request(req_options, (res) => {
      res.setEncoding('utf8');
      let response = '';
      res.on('data', (chunk) => {
        response += chunk;
      });
      res.on('end', () => {
        const parsedResponse: TelegramResponse<Message> = JSON.parse(response);
        if (parsedResponse.ok) {
          resolve(parsedResponse);
        } else {
          reject(parsedResponse || `${res.statusCode} ${res.statusMessage}`);
        }
      });
    });
    req.on('error', (error) => {
      reject(`Error: ${error.message}`);
    });
    if (data) {
      req.write(data);
    } else {
      form.pipe(req);
    }
  });
};
