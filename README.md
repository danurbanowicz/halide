[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Netlify Status](https://api.netlify.com/api/v1/badges/110e596b-182b-4702-8039-c5bd58f59b20/deploy-status)](https://app.netlify.com/sites/halide/deploys)

# Halide

Halide is a very simple and fast image portfolio template, ready for deployment to Netlify.

It uses [Eleventy](https://www.11ty.dev/) under the hood to generate static HTML files from Markdown and YAML content, and  responsive images in next-gen formats like AVIF and WebP.

It doesn't use a front-end framework, and only contains a few lines of vanilla JavaScript to provide some progressive enhancement. Halide leverages native browser features as much as possible.

Halide also comes with [Tina CMS](https://tina.io/) pre-configured. Tina CMS is an open source, headless content management system that uses GitHub as a robust and convenient content store.

## [Demo Site](https://halide.netlify.app)

## Features

- Responsive, static HTML front-end
- Exceptional performance ([Lighthouse test report](https://halide.netlify.app/reports/lighthouse/))
- [Eleventy Image](https://www.11ty.dev/docs/plugins/image/) for optimized images in next-gen formats
- Automated `<picture>` syntax markup with srcset and sizes
- Optional Tina CMS for easy content management
- Dark mode support
- Customizable theme settings, colors, and typography
- Simple HTML/CSS/JS minification pipeline
- Clientside framework-free
- Markdown files for content
- Simple YAML configuration
- Netlify build caching for faster deploys
- Automatic CSP headers

## How it works

Halide site settings are stored inside `_/data/settings.yaml`

It stores project data as `.md` files inside the `projects` folder, and stores source images inside the `assets/uploads` folder.

Halide generates a set of up to 12 optimized image files per source image. Images are cached between builds (local and Netlify). The generated images are not stored in your GitHub repo; only the source image is stored. If the build cache is ever lost or expires, each image will be re-generated from its source on the next build, and cached.

Halide's page structure is very simple. Apart from the [404 page](https://halide.netlify.app/nope), there are just 2 views:

- [Home](https://halide.netlify.app)
- [Project](https://halide.netlify.app/project/british-gq/)

By design, there are no additional pages for a bio, contact etc. You could easily add them if you wanted to, though.

## Getting started

Halide requires a number of services to be configured before it can be deployed. If you don't already have accounts with the following providers, you'll need to set these up first. Each provider’s free plan is sufficient for most use-cases.

1. GitHub
2. Netlify
3. Tina Cloud (if you want to use Tina CMS)

When you've created accounts with the providers listed above, you can proceed with the steps below to set up Halide.

## Setup

### Step 1: Use the Deploy to Netlify button

Pressing the Deploy to Netlify button below will clone this repo and configure a Netlify site for it.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/danurbanowicz/halide#TINA_CMS_CLIENT_ID=replace-with-your-tina-cms-client-id&TINA_CMS_TOKEN=replace-with-your-tina-cms-token&TINA_CMS_SEARCH_TOKEN=replace-with-your-tina-cms-search-token)

Make a note of the site URL Netlify has created for you e.g. https://fantastic-llama.netlify.app

### Step 2: Create a Tina CMS project

Note: The bulk of the configuration relates to Tina CMS, so feel free to skip this step if you're happy working with Markdown and YAML files directly.

1. Navigate to your Tina Cloud [projects dashboard](https://app.tina.io/projects)
2. Create a new custom project, and follow the steps to connect it to your GitHub repo with the required permissions
3. Enter a project name and the live site URL you will use for your your Halide site and press Create Project
4. Navigate to your Tina Cloud project settings and make a note of the client ID, and the Content and Search tokens listed in the Tokens section

### Step 3: Add Tina CMS environmant variables to Netlify

1. In your Netlify account, navigate to Site configuration > Environment variables and replace the dummy values for `TINA_CMS_CLIENT_ID`, `TINA_CMS_TOKEN`, and `TINA_CMS_SEARCH_TOKEN` with the actual values as noted in the previous section
2. Trigger a new deploy in the Netlify UI > Deploys > Trigger deploy > Deploy site

### Step 4: Log in to Tina CMS and configure site settings

1. Navigate to your Tina CMS login URL located at `/admin/` e.g. https://fantastic-llama.netlify.app/admin/ and log in if prompted. (Tina CMS will attempt to log you in with your Tina CLoud credentials)
2. In the Tina CMS dashboard, navigate to Settings > Metadata and enter your Netlify site URL and your site name etc
3. Once you have saved your changes, Netlify will re-build your site

### Step 5. Add a new project

1. Navigate to Tina CMS > Projects and create a new project, making sure to enter a meaningful title and to upload a high-quality image(s).
2. Once you have saved your changes, Netlify will re-build your site and the new project will be visible on your live site

## Local development

You can run Halide and Tina CMS locally for development.

If you want to use Tina CMS, you will need to follow the Tina Cloud account setup steps discussed above.

1. Make a new directory and navigate to it

```
mkdir my-site-name
cd my-site-name
```

2. Clone this repository

```
git clone https://github.com/danurbanowicz/halide.git
```

3. Install dependencies

```
npm install
```

4. Build and serve Halide

Generate a production-ready build to the _site folder:

```
npx tinacms build -c "npx eleventy --serve"
```

Or build and host on a local development server:

```
npx tinacms dev -c "npx eleventy --serve"
```

If you choose to run `dev` your site should now be running on http://localhost:8080 and a local instance of Tina CMS will be available at http://localhost:8080/admin/

## Customization

Halide aims to be more or less ready out of the box for a non-developer user to get up and running. Because of this, it is fairly opinionated with regards to visual design and site structure, but it also aims to be trivial for developer users to modify or extend with additional content or functionality.

### Styles

The [main stylesheet](https://github.com/danurbanowicz/halide/tree/main/_includes/assets/css/base.css) doesn't use any CSS framework, is pure CSS, and is about 7KB in size. It's pretty simple and you are encouraged to modify it to fit your own needs.

CSS variables are configured in `_data/settings.yaml` are declared in `_/includes/assets/css/theme.njk`.

The main stylesheet can be found at `_/includes/assets/css/base.css`. The CSS is bundled and minified during build and output in the head `<style>` tag. Minification settings can be found in the [Eleventy config](https://github.com/danurbanowicz/halide/blob/c9bf4efab88d86e2d514e01b9bbd93f281c65161/.eleventy.js#L154C12-L154C12).

### JavaScript

Halide uses minimal clientside JS which can be found at `_/includes/assets/js/`. JS is bundled and minified during build and output inside an inline `script` tag before the closing `</body>` tag.

If you have enabled Google Analytics, the necessary scripts will be output before the closing `</body>` tag.

## Caveats

### Images

Halide takes a full-size source image and uses [Eleventy Image](https://www.11ty.dev/docs/plugins/image/) and [Sharp](https://github.com/lovell/sharp/) to generate up to 12 optimized variant images in JPEG, WebP, and AVIF formats and in various sizes for the responsive `<picture>` markup. If your site had a total 100 project images, Halide would need to generate 1200 variants! :scream: 

Although the resulting images are only built once (they're cached between builds), it does mean that the first build or any image re-build can take a while. The culprit is Sharp's handling of the AVIF image format which is [very resource-hungry](https://github.com/lovell/sharp/issues/2597). Disabling AVIF format in Halide's image settings is a temporary workaround to reduce first-build times.

## Bugs and questions

If you believe you've found a bug or a serious problem, please open an issue. For everything else, including suggestions and getting help, please [open a discussion](https://github.com/danurbanowicz/halide/discussions).

## Contributing

Pull requests and suggestions are welcome.

## Need some help?

If you need some advanced customization of your Halide website or help with setup, reach out to [@danurbanowicz](https://github.com/danurbanowicz).