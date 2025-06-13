import { describe, it } from '@jest/globals';
import { telegramapis } from '../src/telegram.js';
import path from 'node:path';

if (!process.env.TELEGRAM_TOKEN || !process.env.TELEGRAM_GROUP_LOG) throw new Error('No env found.');

const telegram = telegramapis(process.env.TELEGRAM_TOKEN);
const localImage = path.resolve(process.cwd(), 'test-media', 'image.jpg');
const localVideo = path.resolve(process.cwd(), 'test-media', 'video.mp4');
const photoUrl = 'https://res.cloudinary.com/bbabystyle/image/upload/v1724335266/ninja_art_qu3kkj.webp';
const videoUrl = 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4';

describe('sendMessage', () => {
  it('Should send a message successfully.', async () => {
    await telegram.sendMessage(process.env.TELEGRAM_GROUP_LOG, 'Testing send message...');
  });
});

describe('sendPhoto', () => {
  it('Should send a photo url successfully.', async () => {
    await telegram.sendPhoto(process.env.TELEGRAM_GROUP_LOG, photoUrl, { caption: 'Testing send photo url...' });
  });

  it('Should send a local photo successfully.', async () => {
    await telegram.sendPhoto(process.env.TELEGRAM_GROUP_LOG, localImage, { caption: 'Testing send local photo...' });
  });
});

describe('sendVideo', () => {
  it('Should send a video url successfully.', async () => {
    await telegram.sendVideo(process.env.TELEGRAM_GROUP_LOG, videoUrl, { caption: 'Testing send video url...' });
  });

  it('Should send a local video successfully.', async () => {
    await telegram.sendVideo(process.env.TELEGRAM_GROUP_LOG, localVideo, { caption: 'Testing send local video...' });
  });
});

describe('sendMediaGroup', () => {
  it('Should send a media group successfully.', async () => {
    await telegram.sendMediaGroup(process.env.TELEGRAM_GROUP_LOG, [
      { type: 'photo', media: photoUrl, caption: 'Testing send media group, photo url...' },
      { type: 'video', media: videoUrl, caption: 'Testing send media group, video url...' },
      { type: 'photo', media: localImage, caption: 'Testing send media group, local photo...' },
      { type: 'video', media: localVideo, caption: 'Testing send media group, local video...' },
    ]);
  }, 60_000);
});
