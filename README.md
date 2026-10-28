# Browser AI

A collection of AI demos that run in the browser. The first demo turns an image into a caption with Transformers.js. Choose a sample image or upload your own to try it.

The model runs in a Web Worker so inference does not block the interface. The first run downloads the model, which is then cached by the browser. Captions are model-generated and may be inaccurate.

## Run locally

Requirements: Node.js and pnpm.

```sh
pnpm install
pnpm dev
```

Create a production build with `pnpm build`, or preview it with `pnpm preview`.

## Deploy with Vercel

Import the `browser-ai` repository into Vercel. Vercel detects Vite automatically; use `pnpm build` as the build command and `dist` as the output directory. The included `vercel.json` sends app routes to the SPA entry point so additional demos can use client-side routes.

Vercel will assign a `browser-ai.vercel.app` URL if that project name is available. You can attach a custom domain later.

## Model and assets

This project uses [Transformers.js](https://github.com/huggingface/transformers.js) in the browser. The model is downloaded at runtime from the configured model source; model files are not included in this repository. Sample images are stored in `src/assets`.
