<a name="readme-top"></a>

# Quill - The SaaS for Students

![Quill - The SaaS for Students](/.github/images/img_main.png "Quill - The SaaS for Students")

[![Ask Me Anything!](https://flat.badgen.net/static/Ask%20me/anything?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy "Ask Me Anything!")
[![GitHub license](https://flat.badgen.net/github/license/sanidhyy/quill?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/quill/blob/main/LICENSE "GitHub license")
[![Maintenance](https://flat.badgen.net/static/Maintained/yes?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/quill/commits/main "Maintenance")
[![GitHub branches](https://flat.badgen.net/github/branches/sanidhyy/quill?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/quill/branches "GitHub branches")
[![Github commits](https://flat.badgen.net/github/commits/sanidhyy/quill?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/quill/commits "Github commits")
[![GitHub issues](https://flat.badgen.net/github/issues/sanidhyy/quill?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/quill/issues "GitHub issues")
[![GitHub pull reUpload PDF files](https://flat.badgen.net/github/prs/sanidhyy/quill?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/quill/pulls "GitHub pull reUpload PDF files")
[![Vercel status](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-quill.vercel.app/ "Vercel status")

<!-- Table of Contents -->
<details>

<summary>

# :notebook_with_decorative_cover: Table of Contents

</summary>

- [Folder Structure](#bangbang-folder-structure)
- [Getting Started](#toolbox-getting-started)
- [Screenshots](#camera-screenshots)
- [Tech Stack](#gear-tech-stack)
- [Stats](#wrench-stats)
- [Contribute](#raised_hands-contribute)
- [Acknowledgements](#gem-acknowledgements)
- [Buy Me a Coffee](#coffee-buy-me-a-coffee)
- [Follow Me](#rocket-follow-me)
- [Learn More](#books-learn-more)
- [Deploy on Vercel](#page_with_curl-deploy-on-vercel)
- [Give A Star](#star-give-a-star)
- [Star History](#star2-star-history)
- [Give A Star](#star-give-a-star)

</details>

## :bangbang: Folder Structure

Here is the folder structure of this app.

```bash
quill/
  |- prisma/
    |- schema.prisma
  |- public/
  |- src/
    |-- app/
        |--- _trpc/
        |--- api/
        |--- auth-callback/
        |--- dashboard/
        |--- pricing/
        |--- favicon.ico
        |--- globals.css
        |--- layout.tsx
        |--- page.tsx
    |-- components/
        |--- chat/
        |--- ui/
        |--- billing-form.tsx
        |--- dashboard.tsx
        |--- delete-user-modal.tsx
        |--- icons.tsx
        |--- max-width-wrapper.tsx
        |--- mobile-nav.tsx
        |--- navbar.tsx
        |--- pdf-fullscreen.tsx
        |--- pdf-renderer.tsx
        |--- providers.tsx
        |--- upgrade-button.tsx
        |--- upload-button.tsx
        |--- user-account-nav.tsx
    |-- config/
        |--- infinite-query.ts
        |--- links.ts
        |--- message.ts
        |--- stripe.ts
    |-- db/
        |--- index.ts
    |-- lib/
        |--- validators/
        |--- openai.ts
        |--- pinecone.ts
        |--- stripe.ts
        |--- uploadthing.ts
        |--- utils.ts
    |-- trpc/
        |--- index.ts
        |--- trpc.ts
    |-- types/
        |--- message.ts
    |-- middleware.ts
  |- .env
  |- .env.example
  |- .eslintrc.js
  |- .gitignore
  |- components.json
  |- environment.d.ts
  |- next.config.mjs
  |- package-lock.json
  |- package.json
  |- postcss.config.js
  |- tailwind.config.ts
  |- tsconfig.json
```

<br />

## :toolbox: Getting Started

1. Make sure **Git** and **NodeJS** is installed.
2. Clone this repository to your local computer.
3. Create `.env` file in **root** directory.
4. Contents of `.env`:

```env
# .env

# disabled next.js telemetry
NEXT_TELEMETRY_DISABLED=1

# kinde keys and urls
KINDE_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXX
KINDE_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
KINDE_ISSUER_URL=https://example.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

# neon db uri
DATABASE_URL="postgresql://<user>:<password>@<hostname>:<port>/quill?sslmode=require"

# uploadthing api key and app id
UPLOADTHING_SECRET=sk_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
UPLOADTHING_APP_ID=xxxxxxxxxxx

# app base url
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# pinecone api key
PINECONE_API_KEY=xxxxxxxxxx-xxxxx-xxxx-xxxxxx-xxxxxxxxxxx

# openai api key
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# stripe secret key, price id and webhook secret
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_PRICE_ID=price_XXXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


```

### 5. Next.js Telemetry

- **Environment Variable**: `NEXT_TELEMETRY_DISABLED=1`
- **Instructions**:
  - Open your Next.js project.
  - Locate the `.env` file.
  - Add or update the line `NEXT_TELEMETRY_DISABLED=1` to disable Next.js telemetry.

### 6. Kinde

- **Environment Variables**:
  - `KINDE_CLIENT_ID`
  - `KINDE_CLIENT_SECRET`
  - `KINDE_ISSUER_URL`
  - `KINDE_SITE_URL`
  - `KINDE_POST_LOGOUT_REDIRECT_URL`
  - `KINDE_POST_LOGIN_REDIRECT_URL`
- **Instructions**:
  - Visit [Kinde's website](https://example.kinde.com) and sign in to your account.
  - Navigate to your account settings or developer dashboard to find the API credentials.
  - Retrieve the following:
    - `KINDE_CLIENT_ID`
    - `KINDE_CLIENT_SECRET`
    - `KINDE_ISSUER_URL`
  - For redirect URLs:
    - `KINDE_SITE_URL`
    - `KINDE_POST_LOGOUT_REDIRECT_URL`
    - `KINDE_POST_LOGIN_REDIRECT_URL`

### 7. Neon Database URI

- **Environment Variable**: `DATABASE_URL="postgresql://<user>:<password>@<hostname>:<port>/quill?sslmode=require"`
- **Instructions**:
  - Access your PostgreSQL database management interface.
  - Locate the database connection details.
  - Construct the URI following the provided template and replace the placeholders with your actual database credentials.

### 8. Uploadthing

- **Environment Variables**:
  - `UPLOADTHING_SECRET`
  - `UPLOADTHING_APP_ID`
- **Instructions**:
  - Visit the Uploadthing developer dashboard or website.
  - Log in to your account and navigate to the API or application settings.
  - Retrieve `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`.

### 9. App Base URL

- **Environment Variable**: `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
- **Instructions**:
  - Simply set `NEXT_PUBLIC_BASE_URL=http://localhost:3000` in your `.env` file.

### 10. Pinecone API Key

- **Environment Variable**: `PINECONE_API_KEY=xxxxxxxxxx-xxxxx-xxxx-xxxxxx-xxxxxxxxxxx`
- **Instructions**:
  - Visit Pinecone's official website and log in to your account.
  - Navigate to the API or developer section to find your API key.
  - Retrieve `PINECONE_API_KEY`.

### 11. OpenAI API Key

- **Environment Variable**: `OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Instructions**:
  - Log in to your OpenAI account on the official website.
  - Navigate to the API or developer dashboard.
  - Retrieve your API key.

### 12. Stripe

- **Environment Variables**:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PRICE_ID`
  - `STRIPE_WEBHOOK_SECRET`
- **Instructions**:
  - Log in to your Stripe account.
  - Navigate to the API or developer section.
  - Retrieve the following:
    - `STRIPE_SECRET_KEY`
    - `STRIPE_PRICE_ID`
    - `STRIPE_WEBHOOK_SECRET`

13. Now app is fully configured 👍 and you can start using this app using either one of `npm run dev` or `yarn dev`.

**NOTE:** Please make sure to keep your API keys and configuration values secure and do not expose them publicly.

## :camera: Screenshots

![Modern UI/UX](/.github/images/img1.png "Modern UI/UX")

![Upload PDF files](/.github/images/img2.png "Upload PDF files")

![Ask any question to AI](/.github/images/img3.png "Ask any question to AI")

![Buy Pro Plan](/.github/images/img4.png "Buy Pro Plan")

## :gear: Tech Stack

[![React JS](https://skillicons.dev/icons?i=react "React JS")](https://react.dev/ "React JS") [![Next JS](https://skillicons.dev/icons?i=next "Next JS")](https://nextjs.org/ "Next JS") [![Typescript](https://skillicons.dev/icons?i=ts "Typescript")](https://www.typescriptlang.org/ "Typescript") [![Tailwind CSS](https://skillicons.dev/icons?i=tailwind "Tailwind CSS")](https://tailwindcss.com/ "Tailwind CSS") [![Vercel](https://skillicons.dev/icons?i=vercel "Vercel")](https://vercel.app/ "Vercel") [![Postgresql](https://skillicons.dev/icons?i=postgres "Postgresql")](https://www.postgresql.org/ "Postgresql")

## :wrench: Stats

[![Stats for quill](/.github/images/stats.svg "Stats for quill")](https://pagespeed.web.dev/analysis?url=https://ai-quill.vercel.app/ "Stats for quill")

## :raised_hands: Contribute

You might encounter some bugs while using this app. You are more than welcome to contribute. Just submit changes via pull request and I will review them before merging. Make sure you follow community guidelines.

## :gem: Acknowledgements

Useful resources and dependencies that are used in quill.

- [@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers): ^3.3.4
- [@kinde-oss/kinde-auth-nextjs](https://www.npmjs.com/package/@kinde-oss/kinde-auth-nextjs): ^2.2.3
- [@langchain/openai](https://www.npmjs.com/package/@langchain/openai): ^0.0.28
- [@langchain/pinecone](https://www.npmjs.com/package/@langchain/pinecone): ^0.0.4
- [@mantine/hooks](https://www.npmjs.com/package/@mantine/hooks): ^7.8.0
- [@pinecone-database/pinecone](https://www.npmjs.com/package/@pinecone-database/pinecone): ^2.2.0
- [@prisma/client](https://www.npmjs.com/package/@prisma/client): ^5.12.1
- [@radix-ui/react-avatar](https://www.npmjs.com/package/@radix-ui/react-avatar): ^1.0.4
- [@radix-ui/react-dialog](https://www.npmjs.com/package/@radix-ui/react-dialog): ^1.0.5
- [@radix-ui/react-dropdown-menu](https://www.npmjs.com/package/@radix-ui/react-dropdown-menu): ^2.0.6
- [@radix-ui/react-progress](https://www.npmjs.com/package/@radix-ui/react-progress): ^1.0.3
- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot): ^1.0.2
- [@radix-ui/react-tooltip](https://www.npmjs.com/package/@radix-ui/react-tooltip): ^1.0.7
- [@tailwindcss/typography](https://www.npmjs.com/package/@tailwindcss/typography): ^0.5.12
- [@tanstack/react-query](https://www.npmjs.com/package/@tanstack/react-query): ^5.28.14
- [@trpc/client](https://www.npmjs.com/package/@trpc/client): ^11.0.0-rc.330
- [@trpc/next](https://www.npmjs.com/package/@trpc/next): ^11.0.0-rc.330
- [@trpc/react-query](https://www.npmjs.com/package/@trpc/react-query): ^11.0.0-rc.330
- [@trpc/server](https://www.npmjs.com/package/@trpc/server): ^11.0.0-rc.330
- [@uploadthing/react](https://www.npmjs.com/package/@uploadthing/react): ^6.4.4
- [ai](https://www.npmjs.com/package/ai): ^3.0.21
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority): ^0.7.0
- [clsx](https://www.npmjs.com/package/clsx): ^2.1.0
- [date-fns](https://www.npmjs.com/package/date-fns): ^3.6.0
- [langchain](https://www.npmjs.com/package/langchain): ^0.1.33
- [lucide-react](https://www.npmjs.com/package/lucide-react): ^0.364.0
- [next](https://www.npmjs.com/package/next): 14.1.4
- [next-themes](https://www.npmjs.com/package/next-themes): ^0.3.0
- [openai](https://www.npmjs.com/package/openai): ^4.33.0
- [pdf-parse](https://www.npmjs.com/package/pdf-parse): ^1.1.1
- [react](https://www.npmjs.com/package/react): ^18
- [react-dom](https://www.npmjs.com/package/react-dom): ^18
- [react-dropzone](https://www.npmjs.com/package/react-dropzone): ^14.2.3
- [react-hook-form](https://www.npmjs.com/package/react-hook-form): ^7.51.2
- [react-loading-skeleton](https://www.npmjs.com/package/react-loading-skeleton): ^3.4.0
- [react-markdown](https://www.npmjs.com/package/react-markdown): ^9.0.1
- [react-pdf](https://www.npmjs.com/package/react-pdf): ^7.7.1
- [react-resize-detector](https://www.npmjs.com/package/react-resize-detector): ^10.0.1
- [react-textarea-autosize](https://www.npmjs.com/package/react-textarea-autosize): ^8.5.3
- [simplebar-react](https://www.npmjs.com/package/simplebar-react): ^3.2.4
- [sonner](https://www.npmjs.com/package/sonner): ^1.4.41
- [stripe](https://www.npmjs.com/package/stripe): ^15.1.0
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge): ^2.2.2
- [tailwindcss-animate](https://www.npmjs.com/package/tailwindcss-animate): ^1.0.7
- [uploadthing](https://www.npmjs.com/package/uploadthing): ^6.9.0
- [zod](https://www.npmjs.com/package/zod): ^3.22.4
- [@types/node](https://www.npmjs.com/package/@types/node): ^20
- [@types/react](https://www.npmjs.com/package/@types/react): ^18
- [@types/react-dom](https://www.npmjs.com/package/@types/react-dom): ^18
- [autoprefixer](https://www.npmjs.com/package/autoprefixer): ^10.0.1
- [eslint](https://www.npmjs.com/package/eslint): ^8
- [eslint-config-next](https://www.npmjs.com/package/eslint-config-next): 14.1.4
- [postcss](https://www.npmjs.com/package/postcss): ^8
- [prisma](https://www.npmjs.com/package/prisma): ^5.12.1
- [tailwindcss](https://www.npmjs.com/package/tailwindcss): ^3.3.0
- [typescript](https://www.npmjs.com/package/typescript): ^5

## :coffee: Buy Me a Coffee

[<img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" width="200" />](https://www.buymeacoffee.com/sanidhy "Buy me a Coffee")

## :rocket: Follow Me

[![Follow Me](https://img.shields.io/github/followers/sanidhyy?style=social&label=Follow&maxAge=2592000)](https://github.com/sanidhyy "Follow Me")
[![Tweet about this project](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FTechnicalShubam)](https://twitter.com/intent/tweet?text=Check+out+this+amazing+app:&url=https%3A%2F%2Fgithub.com%2Fsanidhyy%2Fquill "Tweet about this project")
[![Subscribe to my YouTube Channel](https://img.shields.io/youtube/channel/subscribers/UCNAz_hUVBG2ZUN8TVm0bmYw)](https://www.youtube.com/@OPGAMER./?sub_confirmation=1 "Subscribe to my YouTube Channel")

## :books: Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## :page_with_curl: Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## :star: Give A Star

You can also give this repository a star to show more people and they can use this repository.

## :star2: Star History

<a href="https://star-history.com/#sanidhyy/quill&Timeline">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=sanidhyy/quill&type=Timeline&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=sanidhyy/quill&type=Timeline" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=sanidhyy/quill&type=Timeline" />
</picture>
</a>

<br />
<p align="right">(<a href="#readme-top">back to top</a>)</p>
