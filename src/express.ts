import type { Request, Response } from 'express';
import type { SendMessageOptions, TelegramApi } from './telegram.js';
import { errToString, withRetry } from 'coraline';

interface ExpressParams {
  telegram: TelegramApi;
}

export interface TelegramRouteBody {
  chatId: number;
  message: string;
  options?: SendMessageOptions;
}

export const telegramExpress = ({ telegram }: ExpressParams) => {
  return {
    sendMessage: async (req: Request<object, object, Partial<TelegramRouteBody>, object>, res: Response) => {
      try {
        const { chatId, message, options } = req.body;
        if (!chatId || !message) {
          res.status(400).json({ message: 'Missing required parameters.' });
          return;
        }
        await withRetry(() => telegram.sendMessage(chatId, message, options), {
          failMessage: (err, attempt) => `Error while trying to send a telegram message: ${err}, attempt: ${attempt.toString()}`,
          maxAttempts: 3,
          retryIntervalMs: 2000,
        });
        res.status(200).json({ data: { status: 'success' } });
      } catch (err) {
        res.status(400).json({ message: errToString(err) });
      }
    },
  };
};
