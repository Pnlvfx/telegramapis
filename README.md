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
import telegramapis from 'telegramapis';

// replace the value below with the Telegram token you receive from @BotFather
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

const bot = telegramapis(token);
const chatId = 092; // The chat id
const resp = "Hello, you're great";

// send back the matched "whatever" to the chat
await bot.sendMessage(chatId, resp);
```

## License

**The MIT License (MIT)**

Copyright © 2023 Simone Gauli
