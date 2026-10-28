# Image Caption Demo

A small image-to-text demo powered by Transformers.js. Choose a sample image or upload your own, then get a caption generated locally in the browser.

The model runs in a Web Worker so inference does not block the interface. The first run downloads the model, which is then cached by the browser. Captions are model-generated and may be inaccurate.

## Run locally

Requirements: Node.js and pnpm.

```sh
pnpm install
pnpm dev
```

Create a production build with `pnpm build`, or preview it with `pnpm preview`.

## Deploy

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and publishes the app to GitHub Pages when changes are pushed to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

The Vite base path is derived from the GitHub repository name during the Pages build, so the app works as a project site without a custom domain.

## Model and assets

This project uses [Transformers.js](https://github.com/huggingface/transformers.js) in the browser. The model is downloaded at runtime from the configured model source; model files are not included in this repository. Sample images are stored in `src/assets`.
