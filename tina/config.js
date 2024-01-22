import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CMS_CLIENT_ID,
  token: process.env.TINA_CMS_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "_site",
  },
  media: {
    tina: {
      mediaRoot: "assets/uploads",
      publicFolder: "",
    },
  },
  search: {
    tina: {
      indexerToken: process.env.TINA_CMS_SEARCH_TOKEN,
      stopwordLanguages: ["eng"]
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100
  },
  schema: {
    collections: [
      {
        name: "project",
        label: "Projects",
        path: "projects",
        format: "md",
        // set some default values for this collection
				defaultItem: () => {
					return {
            draft: false,
						date: new Date().toISOString(),
					}
				},
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return `${values?.title
                ?.toLowerCase()
                .replace(/ /g, '-')}`
            },
          },
        },
        fields: [
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
            description: "If this is checked the project will not be published",
          },
          {
            type: "string",
            name: "title",
            label: "Title",
            description: "The project's title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "description",
            label: "Description",
            description: "The project's short description",
          },
          {
            type: "number",
            name: "year",
            label: "Year",
            description: "The year the project was realized e.g. 2023",
          },
          {
            type: "object",
            name: "images",
            label: "Images",
            list: true,
            ui: {
              itemProps: (item) => {
                return { label: item?.caption };
              },
            },
            fields: [
              {
                type: "image",
                name: "src",
                label: "Image",
                description: "Upload an image in JPEG or PNG format with a minimum width of 2000 pixels",
              },
              {
                type: "string",
                name: "caption",
                label: "Caption",
                description: "Add a descriptive image caption, used for the image alt text",
              },
            ],
          },
          {
            type: "datetime",
            name: "date",
            label: "Publish Date",
            description: "The published date or today's date (for internal use only)",
            ui: {
							dateFormat: 'YYYY-MM-DD',
							timeFormat: 'HH:MM:SS',
              component: "hidden",
						}
          },
          {
            type: "object",
            name: "seo",
            label: "SEO",
            fields: [
              {
                type: "string",
                name: "title",
                label: "SEO Title",
                description: "Add a different title for SEO purposes (the <title> tag). Defaults to project title",
              },
              {
                type: "string",
                name: "description",
                label: "Meta Description",
                description: "Add a meta description for SEO purposes. Defaults to project short description",
              },
              {
                type: "boolean",
                name: "no_index",
                label: "Prevent Indexing",
                description: "Warning: Adds a <meta> noindex tag to this project to discourage search engines from indexing it. Use with care!",
              },
            ]
          },
          {
            type: "rich-text",
            name: "body",
            label: "Additional Description",
            description: "The project's optional additional description, shown under images",
            isBody: true,
          },
          {
            type: "number",
            name: "position",
            label: "Project Position",
            description: "Adjust this project's position in the project list, as a number between 0 and 999. A lower value pushes the position up.",
            ui:{
              validate: (val)=>{
                if (val < 0 || val >= 1000 ) {
                  return "The number must be between 0 and 999"
                }
              },
            },
          },
        ],
      },
      // Settings File Collection
      {
        name: "settings",
        label: "Settings",
        path: "_data",
        match: {
          include: "settings",
        },
        format: "yaml",
        ui: {
          // Don't allow editors to add or delete settings
          //global: true,
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          // Settings > Metadata
          {
            type: "object",
            name: "metadata",
            label: "Metadata",
            fields: [
              {
                type: "string",
                name: "site_url",
                label: "Site URL",
                required: true,
                description: "Your site's full production URL including https:// and without a trailing slash e.g. https://www.johndoe.com",
              },
              {
                type: "string",
                name: "site_title",
                label: "Site Title",
                required: true,
                description: "The website title, name, or brand e.g. John Doe",
              },
              {
                type: "string",
                name: "site_subtitle_1",
                label: "Site Subtitle",
                description: "Optional text shown after the website title, often used for a job title e.g. Photographer",
              },
              {
                type: "string",
                name: "site_subtitle_2",
                label: "Additional Site Subtitle",
                description: "Optional text shown after the site subtitle, often used to show a location e.g. New York, NY",
              },
              {
                type: "rich-text",
                name: "site_description",
                label: "Site Description",
                description: "Your website's description, shown on the home page only. Keep it short and sweet!",
              },
              {
                type: "string",
                name: "site_email",
                label: "Site Email",
                description: "Your website's contact email address, visible in the site footer.",
              },
              {
                type: "string",
                name: "site_social_url",
                label: "Site Social URL",
                description: "Your primary social media profile URL, visible in the site footer e.g. https://instagram.com/johndoe",
              },
              {
                type: "image",
                name: "site_icon_svg",
                label: "Site Favicon SVG",
                description: "An optional site bookmark/favicon icon in SVG format. Make an SVG favicon here: https://realfavicongenerator.net/svg-favicon/",
              },
              {
                type: "image",
                name: "site_icon_png",
                label: "Site Favicon PNG",
                description: "An optional site bookmark/favicon icon in PNG format. Your image should be 260x260 pixels or more for optimal results. Make a PNG and SVG favicon here: https://realfavicongenerator.net/svg-favicon/",
              },
              {
                type: "string",
                name: "site_ga4_id",
                label: "Google Analytics ID",
                description: "Add a valid GA4 property ID here to enable Google Analytics on your site e.g. G-1234567",
              },
              {
                type: "object",
                name: "seo",
                label: "Site SEO",
                fields: [
                  {
                    type: "string",
                    name: "site_title",
                    label: "Site SEO Title",
                    description: "The website title used for SEO purposes i.e. the <title> tag and social sharing only.",
                  },
                  {
                    type: "string",
                    name: "site_description",
                    label: "Site SEO Description",
                    description: "The website description used for the <meta> description tag and social sharing. This is the description that will likely be shown in Google search results for your site. Maximum 160 characters.",
                  },
                  {
                    type: "boolean",
                    name: "no_index",
                    label: "Block Site Indexing",
                    description: "Warning: Adds a <meta> noindex tag to EVERY page of your website to discourage search engines from indexing them. Overrides per-project settings. Use with care!",
                  },
                ],
              },
            ],
          },
          // Settings > Theme
          {
            type: "object",
            name: "theme",
            label: "Theme",
            fields: [
              {
                type: "object",
                name: "theme_layout",
                label: "Layout",
                fields: [
                  {
                    label: "Space Scale",
                    name: "space_scale",
                    type: "number",
                    description: "The percentage scale used to calculate your site's margins, padding, and line height. Default: 100",
                  },
                ],
              },
              {
                type: "object",
                name: "theme_colors",
                label: "Colors",
                fields: [
                  {
                    type: "string",
                    name: "background",
                    label: "Background Color",
                    description: "The site background color, also used for light mode. Default: #FFFFFF",
                    ui: {
                      component: "color",
                      colorFormat: "hex",
                    },
                  },
                  {
                    type: "string",
                    name: "text",
                    label: "Text Color",
                    description: "The site text color, also used for light mode. Default: #101010",
                    ui: {
                      component: "color",
                      colorFormat: "hex",
                    },
                  },
                  {
                    type: "string",
                    name: "link",
                    label: "Link Color",
                    description: "The site link text color, also used for light mode. Default: #101010",
                    ui: {
                      component: "color",
                      colorFormat: "hex",
                    },
                  },
                  {
                    type: "string",
                    name: "background_dark",
                    label: "Dark Mode Background Color",
                    description: "The site's dark mode background color. Default: #101010",
                    ui: {
                      component: "color",
                      colorFormat: "hex",
                    },
                  },
                  {
                    type: "string",
                    name: "text_dark",
                    label: "Dark Mode Text Color",
                    description: "The site's dark mode text color. Default: #F1F1F1",
                    ui: {
                      component: "color",
                      colorFormat: "hex",
                    },
                  },
                  {
                    type: "string",
                    name: "link_dark",
                    label: "Dark Mode Link Color",
                    description: "The site's dark mode link text color. Default: #F1F1F1",
                    ui: {
                      component: "color",
                      colorFormat: "hex",
                    },
                  },
                ],
              },
              {
                type: "object",
                name: "theme_typography",
                label: "Typography",
                fields: [
                  {
                    type: "string",
                    name: "font",
                    label: "Font",
                    description: "Your site's body font. Select a Google Font or the default system font from the dropdown",
                    options: [
                      {
                        value: "system",
                        label: "System Font (default)"
                      },
                      {
                        value: "Bodoni Moda",
                        label: "Bodoni Moda"
                      },
                      {
                        value: "DM Sans",
                        label: "DM Sans"
                      },
                      {
                        value: "EB Garamond",
                        label: "EB Garamond"
                      },
                      {
                        value: "Fraunces",
                        label: "Fraunces"
                      },
                      {
                        value: "Inter",
                        label: "Inter"
                      },
                      {
                        value: "Overpass Mono",
                        label: "Overpass Mono"
                      },
                      {
                        value: "Public Sans",
                        label: "Public Sans"
                      },
                      {
                        value: "Space Grotesk",
                        label: "Space Grotesk"
                      },
                      {
                        value: "Unbounded",
                        label: "Unbounded"
                      },
                      {
                        value: "Work Sans",
                        label: "Work Sans"
                      },
                    ],
                    // ui: {
                    //   format(value) {
                    //     return value
                    //     .toLowerCase()
                    //     .split(' ')
                    //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    //     .join(' ');
                    //   },
                    // },
                  },
                  {
                    type: "number",
                    name: "font_weight",
                    label: "Font Weight",
                    description: "The site's body font weight. Values range from 100 to 900. Default: 420. See valid weight ranges for Google Fonts variable fonts here: https://fonts.google.com/?vfonly=true",
                  },
                  {
                    type: "number",
                    name: "font_scale",
                    label: "Font Size Scale",
                    description: "The percentage scale used to adjust your site's font size. Default: 100",
                  },
                  {
                    type: "number",
                    name: "line_height_scale",
                    label: "Line Height Scale",
                    description: "The percentage scale used to adjust your site font's line height (vertical spacing). Default: 100",
                  },
                ],
              },
              {
                type: "object",
                name: "theme_features",
                label: "Advanced",
                fields: [
                  {
                    type: "boolean",
                    name: "enable_dark_mode",
                    label: "Enable Dark Mode",
                    description: "Enable the dark mode toggle for your site",
                  },
                  {
                    type: "number",
                    name: "item_output_limit",
                    label: "Max. Project Grid Items",
                    description: "The maximum number of project grid items displayed. Default: 48",
                  },
                  {
                    type: "number",
                    name: "transition_duration",
                    label: "Transition Duration",
                    description: "The length in milliseconds of site animations and transitions. Default: 300",
                  },
                  {
                    type: "boolean",
                    name: "show_project_year",
                    label: "Show Project Year",
                    description: "Show the project year on your site's project pages. Default: true",
                  },
                  {
                    type: "boolean",
                    name: "show_project_grid_titles",
                    label: "Show Grid Titles",
                    description: "Show project titles in your site's project lists. Default: true",
                  },
                ],
              },
            ],
          },
          // Settings > Images
          {
            type: "object",
            name: "images",
            label: "Images",
            description: "Configure responsive image formats and quality settings",
            fields: [
              {
                type: "object",
                name: "avif",
                label: "AVIF Settings",
                fields: [
                  {
                    type: "boolean",
                    name: "enabled",
                    label: "Enabled",
                    description: "Enable AVIF Images?",
                  },
                  {
                    type: "number",
                    name: "quality",
                    label: "AVIF Image Quality",
                    description: "Controls AVIF image compression, from 1-100. A lower value means smaller file sizes but lower image quality. Default: 80",
                    ui:{
                      validate: (val)=>{
                        if (val < 1 || val >= 101 ) {
                          return "The value must be between 1 and 100"
                        }
                      },
                    },
                  },
                ],
              },
              {
                type: "object",
                name: "webp",
                label: "WebP Settings",
                fields: [
                  {
                    type: "boolean",
                    name: "enabled",
                    label: "Enabled",
                    description: "Enable WebP Images?",
                  },
                  {
                    type: "number",
                    name: "quality",
                    label: "WebP Image Quality",
                    description: "Controls WebP image compression, from 1-100. A lower value means smaller file sizes but lower image quality. Default: 80",
                    ui:{
                      validate: (val)=>{
                        if (val < 1 || val >= 101 ) {
                          return "The value must be between 1 and 100"
                        }
                      },
                    },
                  },
                ],
              },
              {
                type: "object",
                name: "jpeg",
                label: "JPEG Settings",
                fields: [
                  {
                    type: "boolean",
                    name: "enabled",
                    label: "JPEG Enabled",
                    description: "JPEG Images must be enabled.",
                    ui: {
                      component: "hidden",
                    }
                  },
                  {
                    type: "number",
                    name: "quality",
                    label: "JPEG Image Quality",
                    description: "Controls JPEG image compression, from 1-100. A lower value means smaller file sizes but lower image quality. Default: 80",
                    ui:{
                      validate: (val)=>{
                        if (val < 1 || val >= 101 ) {
                          return "The value must be between 1 and 100"
                        }
                      },
                    },
                  },
                ],
              },
            ],
          },
          // Settings > i18n
          {
            type: "object",
            name: "i18n",
            label: "Locale & Translation",
            fields: [
              {
                type: "string",
                name: "site_language",
                label: "Site Language",
                description: "Your site's ISO 639-1 two character language code. Default: en",
              },
              {
                type: "string",
                name: "site_social_title",
                label: "Footer Social Title",
                description: "The title used for footer social profile link text e.g. Instagram",
              },
            ],
          },
        ],
      },
    ],
  },
});
