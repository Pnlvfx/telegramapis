import { describe, it } from '@jest/globals';
import telegramapis from '../src';
describe('telegramapis', () => {
  it('Should connect to telegram', () => {
    telegramapis('TEST-TOKEN');
  });
});
