declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TELEGRAM_TOKEN: string;
      TELEGRAM_GROUP_LOG: string;
    }
  }
}

// eslint-disable-next-line unicorn/require-module-specifiers
export {};
