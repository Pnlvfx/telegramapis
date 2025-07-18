declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TELEGRAM_TOKEN: string;
      TELEGRAM_GROUP_LOG: string;
    }
  }
}

export {};
