import { defineConfig } from 'vite'
//import { fileURLToPath, URL } from 'node:url'
import viteReact from '@vitejs/plugin-react'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
//import viteTsConfigPaths from 'vite-tsconfig-paths'


// https://vite.dev/config/
export default defineConfig({
  // resolve: {
  //   alias: {
  //     '@': fileURLToPath(new URL('./src', import.meta.url)),
  //   }
  // },
  base: '/',
  server: {
    port: 3000,
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    devtools(),
    // this is the plugin that enables path aliases
    // viteTsConfigPaths({
    //   projects: ['./tsconfig.json'],
    // }),
    //tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact()
  ],
  optimizeDeps: {
    //exclude: ['@sqlite.org/sqlite-wasm', 'sqlite-wasm-http'],
  },
  ssr: {
    noExternal: ['react-use'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // We get it, we're using deprecated things in the styles. IGNORE!
        silenceDeprecations: ['import', 'global-builtin'],
      }
    }
  }
})
