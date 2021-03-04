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
    //['@snowpack/plugin-optimize', { target: 'es2017', preloadModules: true }],
    '@snowpack/plugin-sass'
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
    preload: true,
    bundle: false,
    minify: true,
    target: 'es2020'
    // {
    //   entrypoints: 'auto' | string[] | ((options: { files: string[] }) => string[]);
    //   preload: boolean;
    //   bundle: boolean;
    //   splitting: boolean;
    //   treeshake: boolean;
    //   manifest: boolean;
    //   minify: boolean;
    //   target: 'es2020' | 'es2019' | 'es2018' | 'es2017';
    // }
    
    
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
