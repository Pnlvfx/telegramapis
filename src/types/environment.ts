/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TELEGRAM_TOKEN: string;
    }
  }
}

export {};
