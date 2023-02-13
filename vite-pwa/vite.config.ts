import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import type { ManifestOptions, VitePWAOptions } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.svg'],
  manifest: {
    name: 'PWA Router',
    short_name: 'PWA Router',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192x192.png', // <== don't add slash, for testing
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png', // <== don't remove slash, for testing
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png', // <== don't add slash, for testing
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  },
}

const replaceOptions = { __DATE__: new Date().toISOString() }
const claims = process.env.CLAIMS === 'true'
const reload = process.env.RELOAD_SW === 'true'
const selfDestroying = process.env.SW_DESTROY === 'true'

//if (process.env.SW === 'true') {
  pwaOptions.srcDir = 'src'
  pwaOptions.filename = 'claims-sw.ts'
  // pwaOptions.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts'
  pwaOptions.strategies = 'injectManifest'
  ;(pwaOptions.manifest as Partial<ManifestOptions>).name = 'PWA Inject Manifest'
  ;(pwaOptions.manifest as Partial<ManifestOptions>).short_name = 'PWA Inject'
//}

if (claims)
  pwaOptions.registerType = 'autoUpdate'

if (reload) {
  // @ts-expect-error overrides
  replaceOptions.__RELOAD_SW__ = 'true'
}

if (selfDestroying)
  pwaOptions.selfDestroying = selfDestroying


// console.log(pwaOptions);
// console.log("NODE_ENV = "+ process.env.NODE_ENV);
// console.log("CLAIMS = "+ process.env.CLAIMS);
// console.log("RELOAD_SW = "+ process.env.RELOAD_SW);
// console.log("platform = "+ process.platform);
// console.log("version = "+ process.version);
// console.log("url = "+ import.meta.url);
// console.log("__dirname = "+ __dirname);
//  console.log("claims = "+ claims);
//  console.log("reload = "+ reload);
//  console.log("selfDestroying = "+ selfDestroying);
//  console.log("replaceOptions = "+ replaceOptions); 
//  console.log(pwaOptions);
//  console.log("NODE_ENV:" + process.env.NODE_ENV);
//  console.log("SOURCE_MAP:" + process.env.SOURCE_MAP);

const outputPluginStats = () => ({
  name: 'output-plugin-stats',
  configResolved(config) {
    const plugins = config.plugins.map((plugin) => plugin.name)
    console.log(`Your project has ${plugins.length} Vite plugins.`)
    console.table(plugins)
  }
})

const requestAnalytics = () => ({
  name: 'request-analytics',
  configureServer(server) {
    return () => {
      server.middlewares.use((req, res, next) => {
        console.log(`${req.method.toUpperCase()} ${req.url}`)
        next()
      })
    }
  }
})
const hotUpdateReport = () => ({
  name: 'hot-update-report',
  handleHotUpdate({file, timestamp, modules}) {
    console.log(`${timestamp}: ${modules.length} module(s) updated`)
  }
})

const vitePluginWrapper  = () => ({
  name: 'vite-plugin-wrapper',
  configResolved(config) {   
      VitePWA(pwaOptions)       
  }
})

export default defineConfig({
        define: {
          appName: JSON.stringify('vite-sandbox'),
          
        },   
        plugins: [
          vue(),
          VitePWA(pwaOptions),   
          //vitePluginWrapper(),
          outputPluginStats(),
          requestAnalytics(),
          hotUpdateReport(),       
          replace(replaceOptions), 
        ],
       
        server:
        {          
          host: true,
          port:433,
        },      
      })
