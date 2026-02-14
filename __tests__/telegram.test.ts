/* eslint-disable no-restricted-properties */
import { describe, it } from 'node:test';
import { createTelegramClient, isTelegramError } from '../src/telegram.ts';
import path from 'node:path';
import assert from 'node:assert';

if (!process.env.TELEGRAM_TOKEN || !process.env.TELEGRAM_GROUP_LOG) throw new Error('No env found.');

const telegram = createTelegramClient(process.env.TELEGRAM_TOKEN);
const localImage = path.resolve(process.cwd(), 'test-media', 'image.jpg');
const localVideo = path.resolve(process.cwd(), 'test-media', 'video.mp4');
const photoUrl = 'https://res.cloudinary.com/bbabystyle/image/upload/v1724335266/ninja_art_qu3kkj.webp';
const videoUrl = 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4';

await describe('sendMessage', async () => {
  await it('Should send a message successfully.', async () => {
    await telegram.sendMessage(process.env.TELEGRAM_GROUP_LOG, 'Testing send message...');
  });
});

await describe('sendPhoto', async () => {
  await it('Should send a photo url successfully.', async () => {
    await telegram.sendPhoto(process.env.TELEGRAM_GROUP_LOG, photoUrl, { caption: 'Testing send photo url...' });
  });

  await it('Should send a local photo successfully.', async () => {
    await telegram.sendPhoto(process.env.TELEGRAM_GROUP_LOG, localImage, { caption: 'Testing send local photo...' });
  });
});

await describe('sendVideo', async () => {
  await it('Should send a video url successfully.', async () => {
    await telegram.sendVideo(process.env.TELEGRAM_GROUP_LOG, videoUrl, { caption: 'Testing send video url...' });
  });

  await it('Should send a local video successfully.', async () => {
    await telegram.sendVideo(process.env.TELEGRAM_GROUP_LOG, localVideo, { caption: 'Testing send local video...' });
  });
});

await describe('sendMediaGroup', async () => {
  await it('Should send a media group successfully.', { timeout: 60_000 }, async () => {
    await telegram.sendMediaGroup(process.env.TELEGRAM_GROUP_LOG, [
      { type: 'photo', media: photoUrl, caption: 'Testing send media group, photo url...' },
      { type: 'video', media: videoUrl, caption: 'Testing send media group, video url...' },
      { type: 'photo', media: localImage, caption: 'Testing send media group, local photo...' },
      { type: 'video', media: localVideo, caption: 'Testing send media group, local video...' },
    ]);
  });
});

await describe('Error handling', async () => {
  await it('Should throw TelegramError for invalid chat_id', async () => {
    try {
      await telegram.sendMessage('invalid_chat_id', 'Test message');
      assert.fail('Should have thrown an error');
    } catch (err) {
      assert.ok(isTelegramError(err), 'Error should be a TelegramError');
      if (isTelegramError(err)) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        assert.ok(err.error_code, 'Should have error_code');
        assert.ok(err.description, 'Should have description');
        assert.strictEqual(err.name, 'TelegramError');
      }
    }
  });

  await it('Should throw TelegramError for invalid token', async () => {
    const invalidTelegram = createTelegramClient('invalid_token');
    try {
      await invalidTelegram.sendMessage(process.env.TELEGRAM_GROUP_LOG, 'Test message');
      assert.fail('Should have thrown an error');
    } catch (err) {
      assert.ok(isTelegramError(err), 'Error should be a TelegramError');
      if (isTelegramError(err)) {
        assert.ok(err.error_code === 401 || err.error_code === 404, 'Should have 401 or 404 error code');
        assert.ok(err.description, 'Should have error description');
      }
    }
  });
});
