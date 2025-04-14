import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import skinRawLoaderPlugin from './plugins/skinRawLoader'
import metadata from './plugins/metadata'

const skin = process.env.SKIN_NAME || fs.readdirSync('./skins')[0]

const srcPath = fileURLToPath(new URL('./src', import.meta.url))

const commitIds = {
  frontend: 'fedummy',
  skin: 'skindummy'
}
const versionHeader = crypto.createHash('md5')
    .update(skin + JSON.stringify(commitIds))
    .digest('hex')
    .slice(0, 17)

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    vue(),
    vueDevTools(),
    skinRawLoaderPlugin(skin),
    ...(isSsrBuild ? [] : [
      metadata({ skin, versionHeader, commitIds })
    ])
  ],
  define: {
    __THETREE_COMMIT_IDS__: JSON.stringify(commitIds),
    __THETREE_VERSION_HEADER__: JSON.stringify(versionHeader)
  },
  base: process.env.NODE_ENV === 'production' ? `/skins/${skin}` : '/',
  publicDir: isSsrBuild ? false : 'public',
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      // vue: 'vue/dist/vue.esm-bundler.js',
      '@': srcPath,
      '~': srcPath,
      'skin': path.resolve('./skins', skin),

      'vuex': path.resolve(srcPath, 'main'),
    },
  },
  server: {
    proxy: {
      '/internal': {
        target: process.env.API_HOST || 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        format: isSsrBuild ? 'cjs' : 'esm'
      }
    }
  },
  ssr: {
    noExternal: true
  }
}))
