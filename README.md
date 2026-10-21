# Kwasi AD Portfolio

A motion-led Astro portfolio for Kwasi AD, built for static deployment on GitHub Pages.

## Stack

- Astro + TypeScript
- GSAP for authored motion
- Lenis as the only smooth-scroll engine
- Markdown content collections for project stories

## Local development

```sh
npm install
npm run dev
```

Production verification:

```sh
npm run build
```

## Editing content

- Site identity and loader translations: `src/data/site.ts`
- Project stories and credits: `src/content/projects/`
- Portfolio media: `public/images/`
- Global visual system: `src/styles/global.css`

Every project entry follows the typed schema in `src/content.config.ts`. Add a Markdown file and the case-study route is generated automatically.

## Deployment

The workflow at `.github/workflows/deploy.yml` builds and publishes the site through GitHub Pages on every push to `main`. In the repository settings, set **Pages → Source** to **GitHub Actions**.

The Astro configuration derives the repository base path from GitHub Actions, so project and asset links work at `username.github.io/repository-name/`.

## Media provenance

The initial media edit was exported from the public profiles explicitly supplied for this portfolio:

- [@akyems_very_own](https://www.instagram.com/akyems_very_own/)
- [@afrofuture](https://www.instagram.com/afrofuture/)

Replace these web-resolution exports with approved high-resolution originals before a major public campaign. Keep creator and collaborator credits accurate in each project Markdown file.

The multilingual loader uses draft English, Twi, French, and Swahili copy. Have the Twi and Swahili wording reviewed by fluent speakers before a high-profile launch.
