import { defineConfig } from 'astro/config';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const owner = process.env.GITHUB_REPOSITORY_OWNER;

export default defineConfig({
  site: owner ? `https://${owner}.github.io` : 'https://example.com',
  base: repository ? `/${repository}` : '/',
  output: 'static',
  build: {
    assets: '_assets'
  }
});
