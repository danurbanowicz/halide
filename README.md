[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Netlify Status](https://api.netlify.com/api/v1/badges/110e596b-182b-4702-8039-c5bd58f59b20/deploy-status)](https://app.netlify.com/sites/halide/deploys)

# Halide

Halide is a minimalist image portfolio template for deployment to Netlify. It uses [Eleventy](https://www.11ty.dev/) and [Eleventy Image](https://www.11ty.dev/docs/plugins/image/) behind the scenes to generate static HTML pages from Markdown, and responsive images in next-gen formats like AVIF and WebP. It doesn't use a front-end framework, and only contains a few lines of vanilla JavaScript to provide some progressive enhancement. Halide leverages native browser features as much as possible. For example, the `loading` attribute for native image lazy loading and the `prefers-color-scheme` CSS media feature.

Halide also comes with [Tina CMS](https://tina.io/) pre-configured. Tina CMS is an open source, headless content management system that uses GitHub as a robust and convenient content store.

## Demo: [halide.netlify.app](https://halide.netlify.app)

## Features

- Fast, static HTML front-end (Lighthouse results)
- Mobile-first responsive layout
- Dark mode support
- Customizable theme settings, colors, and typography
- Minification pipeline
- Clientside framework-free
- Content as MD and YAML files
- Eleventy Image for responsive images in next-gen formats
- Netlify build caching for faster deploys
- Automatic CSP with hashing support

## Getting started

Halide requires a number of services to be configured before it can be deployed. If you don't already have accounts with the following providers, you'll need to set these up first. Each provider’s free plan is sufficient for most use-cases.

1. GitHub
2. Netlify
3. Tina Cloud (if you want to use Tina CMS)

When you've created accounts with the providers listed above, you can proceed with the steps below to set up Halide.

## Setup

_This readme is a work in progress, setup steps may be incomplete or outdated._

Pressing the Deploy to Netlify button below will clone this repo and configure a Netlify site for it.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/danurbanowicz/halide#TINA_CMS_CLIENT_ID=replace-with-your-tina-cms-client-id&TINA_CMS_TOKEN=replace-with-your-tina-cms-token&TINA_CMS_SEARCH_TOKEN=replace-with-your-tina-cms-search-token)

You can also clone or fork this repo and create a new Netlify site for it manually.

### Step 1: Configure Tina CMS

Note: The bulk of the configuration relates to Tina CMS so feel free to skip this step if you're happy working with MD and YAML files directly.

1. Navigate to your Tina Cloud [projects dashboard](https://app.tina.io/projects)
2. Create a new custom project, and follow the steps to connect it to your GitHub repo with the required permissions
3. Enter a project name and the live site URL you will use for your your Halide site and press Create Project
4. Navigate to your Tina Cloud project settings and make a note of the client ID, and the Content and Search tokens listed in the Tokens section
5. In your Netlify account, navigate to Site configuration > Environment variables and replace the dummy values for `TINA_CMS_CLIENT_ID`, `TINA_CMS_TOKEN`, and `TINA_CMS_SEARCH_TOKEN` with the actual values as noted in the previous step

### Step 2: To do

### Step 3: To do

_This readme is a work in progress, setup steps may be incomplete or outdated._

## About images

Halide generates a set of up to 12 optimized image files per source image. Images are stored between builds in Netlify's build cache. These generated images, although cached, are considered as ephemeral and are not stored in your GitHub repo; only the source image is stored. If the build cache is ever lost or expires, each image will be re-generated from its source on the next build and cached.

## Bugs and questions

If your question relates to a possible bug or problem with this project, please open an issue. For everything else, including suggestions, please use [GitHub Discussions](https://github.com/danurbanowicz/halide/discussions).

## Contributing

Pull requests and suggestions are welcome.

## Customization service

If you need any special customization of your Halide website, reach out to [@danurbanowicz](https://github.com/danurbanowicz).