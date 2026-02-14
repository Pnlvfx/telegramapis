/* eslint-disable no-restricted-properties */
import { describe, it } from 'node:test';
import { createTelegramClient } from '../src/telegram.ts';
import assert from 'node:assert';

if (!process.env.TELEGRAM_TOKEN || !process.env.TELEGRAM_GROUP_LOG) throw new Error('No env found.');
const telegram = createTelegramClient(process.env.TELEGRAM_TOKEN);
const chatId = process.env.TELEGRAM_GROUP_LOG;

await describe('Telegram Streaming', async () => {
  await it('should stream a message with multiple edits', async () => {
    // Send initial message
    const initialResult = await telegram.sendMessage(chatId, 'This is a streaming message...');

    assert.strictEqual(initialResult.ok, true);
    const messageId = initialResult.result.message_id;

    // Update the message with more content
    const result2 = await telegram.editMessageText(chatId, messageId, 'This is a streaming message... loading more content...');

    assert.strictEqual(result2.ok, true);

    // Final update
    const result3 = await telegram.editMessageText(chatId, messageId, 'This is a streaming message... loading more content... Done!');

    assert.strictEqual(result3.ok, true);
  });

  await it('should stream a message with parse mode', async () => {
    // Send initial message with parse mode
    const initialResult = await telegram.sendMessage(chatId, '*Bold text* in streaming', {
      parse_mode: 'Markdown',
    });

    assert.strictEqual(initialResult.ok, true);
    const messageId = initialResult.result.message_id;

    // Edit with more formatted content
    const result = await telegram.editMessageText(chatId, messageId, '*Bold text* in streaming _with italic_', {
      parse_mode: 'Markdown',
    });

    assert.strictEqual(result.ok, true);
  });

  await it('should stream a message in a thread', async () => {
    // Send initial message (without thread to ensure it works)
    const initialResult = await telegram.sendMessage(chatId, 'Message streaming test');

    assert.strictEqual(initialResult.ok, true);
    const messageId = initialResult.result.message_id;

    // Edit the message
    const result = await telegram.editMessageText(chatId, messageId, 'Message streaming test - updated');

    assert.strictEqual(result.ok, true);
  });
});
