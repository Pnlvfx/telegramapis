import { describe, it } from '@jest/globals';
import telegramapis from '../src/telegram.js';

if (!process.env.TELEGRAM_TOKEN || !process.env.TELEGRAM_GROUP_LOG) throw new Error('No env found.');

const telegram = telegramapis(process.env.TELEGRAM_TOKEN);
const photoUrl = 'https://res.cloudinary.com/bbabystyle/image/upload/v1724335266/ninja_art_qu3kkj.webp';
const videoUrl = 'https://cdn.openai.com/sora/videos/paper-airplanes.mp4';

describe('sendMessage', () => {
  it('Should send a message successfully.', async () => {
    await telegram.sendMessage(process.env.TELEGRAM_GROUP_LOG, `Testing send message...`);
  });
});

describe('sendPhoto', () => {
  it('Should send a photo url successfully.', async () => {
    await telegram.sendPhoto(process.env.TELEGRAM_GROUP_LOG, photoUrl, { caption: 'Testing send photo...' });
  });
});

describe('sendMediaGroup', () => {
  it('Should send a media group successfully.', async () => {
    await telegram.sendMediaGroup(process.env.TELEGRAM_GROUP_LOG, [
      { type: 'photo', media: photoUrl, caption: 'Testing send media group, photo...' },
      { type: 'video', media: videoUrl, caption: 'Testing send media group, video...' },
    ]);
  });
});
