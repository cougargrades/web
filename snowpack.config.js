/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
    ['@snowpack/plugin-sass', { compilerOptions: { loadPath: ['node_modules'] } }]
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /*
      See: https://www.snowpack.dev/guides/optimize-and-bundle
    */
    preload: false,
    bundle: true,
    minify: true,
    target: 'es2020'
  },
  packageOptions: {
    /* ... */
    polyfillNode: true,
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
