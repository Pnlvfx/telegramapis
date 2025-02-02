import { input } from '@goatjs/node/input';
import { telegramapis } from './telegram.js';
import path from 'node:path';

if (!process.env.TELEGRAM_TOKEN || !process.env.TELEGRAM_GROUP_LOG) throw new Error('No env found.');

const telegram = telegramapis(process.env.TELEGRAM_TOKEN);
const localImage = path.resolve(process.cwd(), 'test-media', 'image.jpg');
const localVideo = path.resolve(process.cwd(), 'test-media', 'video.mp4');
const photoUrl = 'https://res.cloudinary.com/bbabystyle/image/upload/v1724335266/ninja_art_qu3kkj.webp';
const videoUrl = 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4';

const run = async () => {
  const text = await input.create();
  switch (text) {
    case '0': {
      await telegram.sendPhoto(process.env.TELEGRAM_GROUP_LOG, photoUrl, { caption: 'Testing send photo url...' });
      break;
    }
    case '1': {
      await telegram.sendMediaGroup(process.env.TELEGRAM_GROUP_LOG, [
        { type: 'photo', media: photoUrl, caption: 'Testing send media group, photo url...' },
        { type: 'video', media: videoUrl, caption: 'Testing send media group, video url...' },
        { type: 'photo', media: localImage, caption: 'Testing send media group, local photo...' },
        { type: 'video', media: localVideo, caption: 'Testing send media group, local video...' },
      ]);
    }
  }
  void run();
};

void run();
