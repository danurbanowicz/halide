const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const htmlmin = require("html-minifier");
const yaml = require("js-yaml");
const slugify = require("slugify");
const eleventyHelmetPlugin = require("eleventy-plugin-helmet");
const EleventyFetch = require("@11ty/eleventy-fetch");
const Image = require("@11ty/eleventy-img");
const MarkdownIt = require("markdown-it");
const mdRender = new MarkdownIt();

module.exports = function(eleventyConfig) {

  eleventyConfig.addFilter("renderUsingMarkdown", function(rawString) {
    return mdRender.render(rawString);
  });

  // https://www.11ty.dev/docs/plugins/image/
  // Generate PNG icon files and a link tag from a source SVG or PNG file
  eleventyConfig.addShortcode("favicon", async function(src) {

    // Remove preceding slash from image path if it exists
    src = src.startsWith("/") ? src.slice(1) : src;

		let metadata = await Image(src, {
			widths: [48,192,512],
			formats: ["png"],
      urlPath: "/",
      outputDir: "./_site/",
      filenameFormat: function (id, src, width, format, options) {
		    const name = "favicon";
        return `${name}-${width}.${format}`;
      }
		});

    // Build the icon link tag
    let data = metadata.png[0];
		return `<link rel="icon" href="${data.url}" type="image/png">`;

	});

  // Shortcode to generate a responsive project image
  eleventyConfig.addShortcode("generateImage", async function(params) {

    // Destructure the paramaters object and set some defaults
    let {
      src, // throw an error if src is missing
      alt = "",
      classes = "",
      loadingType = "lazy",
      viewportSizes = "",
      outputWidths = ["1080","1800","2400"],
      outputFormats = ["jpeg"],
      outputQualityJpeg = 75,
      outputQualityWebp = 75,
      outputQualityAvif = 75
    } = params;

    // Tina CMS prefixes uploaded img src with a forward slash (?)
    // Remove it from the image path if it exists
    src = src.startsWith("/") ? src.slice(1) : src;

    let metadata = await Image(src, {
      widths: outputWidths,
      sharpJpegOptions: { quality: outputQualityJpeg },
      sharpWebpOptions: { quality: outputQualityWebp },
      sharpAvifOptions: { quality: outputQualityAvif },
      formats: outputFormats,
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
      cacheOptions: {
        // If image is a remote URL, this is the amount of time before 11ty fetches a fresh copy
        duration: "5y",
        directory: ".cache",
        removeUrlQueryParams: true,
      },
    });

    let lowsrc = metadata.jpeg[0];

    let orientation;

    // Detect and set image orientation
    if (lowsrc.width > lowsrc.height) {
      orientation = "landscape";
    } else if (lowsrc.width < lowsrc.height) {
      orientation = "portrait";
    } else {
      orientation = "square";
    }

    return `<picture class="${classes}" data-orientation="${orientation}">
			${Object.values(metadata).map(imageFormat => {
				return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${viewportSizes}">`;
			}).join("\n")}
				<img
					src="${lowsrc.url}"
					width="${lowsrc.width}"
					height="${lowsrc.height}"
					alt="${alt}"
          class="hover-fade"
					loading="${loadingType}"
					decoding="async">
			  </picture>`;
  
  });

  // Add 11ty helmet plugin, for appending elements to <head>
  eleventyConfig.addPlugin(eleventyHelmetPlugin);

  // Add support for YAML data files with .yaml extension
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  // Merge 11ty data instead of overriding values
  eleventyConfig.setDataDeepMerge(true);

  // The projects collection, sorted by the numerical position value and then by date
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("projects/*.md")
      //.filter(project => !Boolean(project.data.draft))
      .sort((a, b) => b.data.position - a.data.position);
  });

  // A filter to limit output of collection items
  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });

  // A filter to limit and randomize output of collection items
  eleventyConfig.addFilter("randomLimit", (arr, limit, currPage) => {
    const pageArr = arr.filter((page) => page.url !== currPage);
    pageArr.sort(() => {
      return 0.5 - Math.random();
    });
    return pageArr.slice(0, limit);
  });

  // Filter to format Google Fonts font name for use in link URLs
  eleventyConfig.addFilter("formatGoogleFontName", name => {
    return name.replace(/\s/g, '+');
  });
  
  // Date formatting (human readable)
  eleventyConfig.addFilter("dateFullYear", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy");
  });

  // base64 encode a string
  eleventyConfig.addFilter("encodeURL", function(url) {
    return encodeURIComponent(url);
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Create a hash from date (e.g. for permalinks)
  eleventyConfig.addFilter("hashFromDate", dateObj => {
    return new Number(DateTime.fromJSDate(dateObj)).toString(36);
  });

  // Universal slug filter makes-strict-urls-like-this
  eleventyConfig.addFilter("slug", function(str) {
    return slugify(str, {
      lower: true,
      replacement: "-",
      strict: true
    });
  });

  // Shortcode to download, cache, and minify Google Fonts CSS to reduce HTTP requests on the front-end
  // TODO Consider downloading the font file itself and storing in the build cache
  eleventyConfig.addShortcode("googleFontsCss", async function(url) {

    let fontCss = await EleventyFetch(url, {
      duration: "1d",
      type: "text",
      fetchOptions: {
        headers: {
          // Google Fonts API serves font formats based on the browser user-agent header
          // So here we pretend to be a browser... in this case, Chrome 74 on MacOS 14
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
        }
      }
    });

    //return fontCss;
    return new CleanCSS({}).minify(fontCss).styles;
  
  });

  // Copy folders or static assets e.g. images to site output
  eleventyConfig.addPassthroughCopy({"assets/icons/favicon.svg" : "/favicon.svg"});

  // Disable 11ty dev server live reload when using CMS locally
  eleventyConfig.setServerOptions({
    liveReload: false
  });

  return {
    templateFormats: ["md", "njk", "liquid"],
    pathPrefix: "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};