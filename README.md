<h1 align="center">Node.js Telegram Bot API</h1>

<div align="center">

A lightweight Node.js package for interacting with the official [Telegram Bot API](https://core.telegram.org/bots/api), created to address deprecated packages, bugs, and enhance usability.

[![Bot API](https://img.shields.io/badge/Bot%20API-v.6.8-00aced.svg?style=flat-square&logo=telegram)](https://core.telegram.org/bots/api)
[![npm package](https://img.shields.io/npm/v/telegramapis?logo=npm&style=flat-square)](https://www.npmjs.org/package/telegramapis)
[![Build Status](https://img.shields.io/travis/yourusername/telegramapis/master?style=flat-square&logo=travis)](https://travis-ci.org/yourusername/telegramapis)
[![Coverage Status](https://img.shields.io/codecov/c/github/yourusername/telegramapis?style=flat-square&logo=codecov)](https://codecov.io/gh/yourusername/telegramapis)

[![https://telegram.me/yourtelegramchannel](https://img.shields.io/badge/💬%20Telegram-Channel-blue.svg?style=flat-square)](https://telegram.me/yourtelegramchannel)
[![https://t.me/yourtelegramgroup](https://img.shields.io/badge/💬%20Telegram-Group-blue.svg?style=flat-square)](https://t.me/yourtelegramgroup)
[![https://telegram.me/YourName](https://img.shields.io/badge/💬%20Telegram-YourName-blue.svg?style=flat-square)](https://telegram.me/YourName)

</div>

## 📦 Install

```sh
npm install telegramapis
```

<br/>

## 🚀 Why Use Telegram APIs

The Telegram APIs package was developed to address the shortcomings of the original Telegram Bot API, which often included deprecated packages and bugs. We designed this package to provide a reliable and streamlined solution. Key features include:

    Simplicity: A lightweight package with minimal dependencies.
    Robustness: Avoids deprecated packages and known issues.
    TypeScript Support: Includes TypeScript typings for enhanced development.

## 🚀 Usage

```js
import telegramapis from "telegramapis";

// replace the value below with the Telegram token you receive from @BotFather
const token = "YOUR_TELEGRAM_BOT_TOKEN";

const bot = telegramapis(token);
const chatId = 092; // The chat id
const resp = "Hello, you're great";

// send back the matched "whatever" to the chat
bot.sendMessage(chatId, resp);
```

## 📚 Documentation

- [Usage][usage]
- [Examples][examples]
- [Tutorials][tutorials]
- [Help Information][help]
- API Reference: ([api-release](../master/doc/api.md) / [development][api-dev] / [experimental][api-experimental])
- [Contributing to the Project][contributing]
- [Experimental Features][experimental]

_**Note**: Development is done against the **development** branch.
Code for the latest release resides on the **master** branch.
Experimental features reside on the **experimental** branch._

## 💭 Community

We thank all the developers in the Open-Source community who continuously
take their time and effort in advancing this project.
See our [list of contributors][contributors].

We have a [Telegram channel][tg-channel] where we post updates on
the Project. Head over and subscribe!

We also have a [Telegram group][tg-group] to discuss issues related to this library.

Some things built using this library that might interest you:

- [tgfancy](https://github.com/GochoMugo/tgfancy): A fancy, higher-level wrapper for Telegram Bot API
- [node-telegram-bot-api-middleware](https://github.com/idchlife/node-telegram-bot-api-middleware): Middleware for node-telegram-bot-api
- [teleirc](https://github.com/FruitieX/teleirc): A simple Telegram ↔ IRC gateway
- [bot-brother](https://github.com/SerjoPepper/bot-brother): Node.js library to help you easily create telegram bots
- [redbot](https://github.com/guidone/node-red-contrib-chatbot): A Node-RED plugin to create telegram bots visually
- [node-telegram-keyboard-wrapper](https://github.com/alexandercerutti/node-telegram-keyboard-wrapper): A wrapper to improve keyboards structures creation through a more easy-to-see way (supports Inline Keyboards, Reply Keyboard, Remove Keyboard and Force Reply)
- [beetube-bot](https://github.com/kodjunkie/beetube-bot): A telegram bot for music, videos, movies, EDM tracks, torrent downloads, files and more.
- [telegram-inline-calendar](https://github.com/VDS13/telegram-inline-calendar): Date and time picker and inline calendar for Node.js telegram bots.
- [telegram-captcha](https://github.com/VDS13/telegram-captcha): Telegram bot to protect Telegram groups from automatic bots.

## 👥 Contributors

<p align="center">
  <a href="https://github.com/yagop/node-telegram-bot-api/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=yagop/node-telegram-bot-api" />
  </a>
</p>

## License

**The MIT License (MIT)**

Copyright © 2023 Simone Gauli
