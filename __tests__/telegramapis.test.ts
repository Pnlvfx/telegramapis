import { describe, it } from '@jest/globals';
import telegramapis from '../src/index.js';

describe('telegramapis', () => {
  it('Should initialize telegram', () => {
    telegramapis(process.env.TELEGRAM_TOKEN);
  });
});
