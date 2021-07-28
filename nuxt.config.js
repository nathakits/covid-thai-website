export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Thailand's Covid-19 Vaccination Tracker",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "msapplication-TileColor", content: "#27AE60" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap",
      },
    ],
  },

  loadingIndicator: {
    name: "~/loader.html",
    color: "#3B8070",
    background: "white",
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/scss/main.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~/plugins/gtag"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    "@nuxtjs/eslint-module",
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    "@nuxtjs/sitemap",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: "Thailand's Covid-19 Vaccination Tracker",
      short_name: "Covid19 Vaccination Tracker",
      description:
        "Tracking Covid-19 vaccination progress in Thailand (Unofficial)",
      lang: "en",
      theme_color: "#27AE60",
    },
    meta: {
      name: "Thailand's Covid-19 Vaccination Tracker",
      author: "Nathakit Sae-Tan",
      description: "Thailand's Covid-19 Vaccination Tracker",
      theme_color: "#27AE60",
      ogSiteName: "Thailand's Covid-19 Vaccination Tracker",
      ogTitle: "Thailand's Covid-19 Vaccination Tracker",
      ogDescription:
        "Tracking Covid-19 vaccination progress in Thailand (Unofficial)",
      ogHost: "https://covidtracker-th.netlify.app",
      ogImage: "/icon.png",
      twitterSite: "@nathakit_tan",
      twitterCreator: "@nathakit_tan",
    },
    icon: {
      source: "./static/icon.png",
    },
  },

  sitemap: {
    hostname: "https://covidtracker-th.netlify.app",
    gzip: true,
    exclude: ["/_nuxt/**"],
    defaults: {
      changefreq: "weekly",
      lastmod: new Date(),
      lastmodrealtime: true,
    },
    trailingSlash: true,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    filenames: {
      font: ({ isDev }) =>
        isDev ? "[path][name].[ext]" : "fonts/[name].[hash:7].[ext]",
      video: ({ isDev }) =>
        isDev ? "[path][name].[ext]" : "videos/[name].[hash:7].[ext]",
    },
    quiet: false,
  },
}
