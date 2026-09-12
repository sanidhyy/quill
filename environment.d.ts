// This file is needed to support autocomplete for process.env
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // neon db uri
      DATABASE_URL: string;

      // uploadthing token
      UPLOADTHING_TOKEN: string;

      // app base url
      NEXT_PUBLIC_BASE_URL: string;

      // encrypted user API keys cookie
      AI_SETTINGS_COOKIE_NAME: string;
      VERIFICATION_SECRET: string;

      // stripe secret key, price id and webhook secret
      STRIPE_SECRET_KEY: string;
      STRIPE_PRICE_ID: string;
      STRIPE_WEBHOOK_SECRET: string;
    }
  }
}
