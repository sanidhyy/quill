// This file is needed to support autocomplete for process.env
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // neon db uri
      DATABASE_URL: string;

      // uploadthing api key and app id
      UPLOADTHING_SECRET: string;
      UPLOADTHING_APP_ID: string;

      // app base url
      NEXT_PUBLIC_BASE_URL: string;

      // pinecone api key
      PINECONE_API_KEY: string;

      // openai api key
      OPENAI_API_KEY: string;

      // stripe secret key, price id and webhook secret
      STRIPE_SECRET_KEY: string;
      STRIPE_PRICE_ID: string;
      STRIPE_WEBHOOK_SECRET: string;
    }
  }
}
