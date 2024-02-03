import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import commonjs from 'vite-plugin-commonjs'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'packages/autocomplete-vue/index.js'),
      name: 'autocomplete',
      // the proper extensions will be added
      fileName: 'autocomplete',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      // input:'packages/autocomplete-vue/index.js',
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
      // output: [
      //   {
      //     file: `${root}/${pkg.main}`,
      //     format: 'cjs',
      //   },
      //   {
      //     file: `${root}/${pkg.module}`,
      //     format: 'esm',
      //   },
      // ],
    },
  },
  // root: 'packages/autocomplete-vue',
  plugins: [
    commonjs(),
    vue({
      css: false,
      compileTemplate: true,
      template: {
        isProduction: true,
      },
    }),
  ],
})
