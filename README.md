<h1 align="center">Node.js Telegram Bot API</h1>

<div align="center">

A lightweight, type-safe Node.js package for interacting with the official [Telegram Bot API](https://core.telegram.org/bots/api), built with TypeScript and Zod validation.

[![Bot API](https://img.shields.io/badge/Bot%20API-v.7.0-00aced.svg?style=flat-square&logo=telegram)](https://core.telegram.org/bots/api)
[![npm package](https://img.shields.io/npm/v/@goatjs/telegram?logo=npm&style=flat-square)](https://www.npmjs.org/package/@goatjs/telegram)

</div>

## 📦 Install

```sh
npm install telegramapis
```

<br/>

## 🚀 Why Use Telegram APIs

The Telegram APIs package was developed to address the shortcomings of the original Telegram Bot API, which often included deprecated packages and bugs. We designed this package to provide a reliable and streamlined solution. Key features include:

    Simplicity: A lightweight package with 0 dependencies.
    Robustness: Avoids deprecated packages and known issues.
    TypeScript Support: Includes TypeScript typings for enhanced development.

## 🚀 Usage

```js
import telegramapis, { TelegramError, isTelegramError } from 'telegramapis';

// replace the value below with the Telegram token you receive from @BotFather
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

const bot = telegramapis(token);
const chatId = 092; // The chat id
const resp = "Hello, you're great";

// send back the matched "whatever" to the chat
await bot.sendMessage(chatId, resp);
```

## ⚠️ Error Handling

The package provides a `TelegramError` class for handling Telegram API errors:

```js
import telegramapis, { TelegramError, isTelegramError } from 'telegramapis';

const bot = telegramapis('YOUR_TELEGRAM_BOT_TOKEN');

try {
  await bot.sendMessage(chatId, 'Hello');
} catch (error) {
  if (isTelegramError(error)) {
    console.log('Telegram API Error:', error.error_code, error.description);
    // Error codes: https://core.telegram.org/bots/api#making-requests
  } else {
    console.log('Network or other error:', error);
  }
}
```

### TelegramError Properties

| Property      | Type      | Description                               |
| ------------- | --------- | ----------------------------------------- |
| `error_code`  | `number`  | Error code returned by Telegram           |
| `description` | `string`  | Human-readable error description          |
| `parameters`  | `object?` | Optional parameters (e.g., `retry_after`) |

### Common Error Codes

- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (bot blocked by user)
- `404` - Not Found
- `429` - Too Many Requests (retry after `parameters.retry_after` seconds)

## License

**The MIT License (MIT)**

Copyright © 2023 Simone Gauli
