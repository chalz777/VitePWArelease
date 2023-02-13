import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
//import { VitePWA } from 'vite-plugin-pwa'
import { VitePWA } from './top-dist/index.mjs';
//import { VitePWA } from './src/lib/index'
//import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import replace from '@rollup/plugin-replace';
//import commonjs from 'vite-plugin-commonjs'
//import { nodeExternals } from './src/lib/plugins/node-externals'
var pwaOptions = {
    mode: 'development',
    base: '/',
    includeAssets: ['favicon.svg'],
    manifest: {
        name: 'PWA Router',
        short_name: 'PWA Router',
        theme_color: '#ffffff',
        icons: [
            {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: '/pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            },
            {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
            },
        ]
    },
    devOptions: {
        enabled: process.env.SW_DEV === 'true',
        /* when using generateSW the PWA plugin will switch to classic */
        type: 'module',
        navigateFallback: 'index.html'
    }
};
// "\"development\"": JSON.stringify(process.env.NODE_ENV),
// 'process.platform': JSON.stringify(process.platform),
//'import.meta.url': JSON.stringify(import.meta.url)
//'preventAssignment': true , 'process.platform': JSON.stringify(process.platform),
//'process.env.NODE_ENV':JSON.stringify(process..env.NODE_ENV)'preventAssignment'
var replaceOptions = { __DATE__: new Date().toISOString() };
// const replaceOptions = {
//   delimiters: ["", ""],
//   values: {
//     // replace dynamic checks with if (false) since this is for
//     // browser only. Rollup's dead code elimination will remove
//     // any code guarded by if (isNode) { ... }    
//     //"if (isNode)": "if (false)",
//     __DATE__: new Date().toISOString(),
//   },
//   preventAssignment: true,
// }
// {
//   values: { 'process.env.DEBUG': 'false',__DATE__: new Date().toISOString()},
// }
var claims = process.env.CLAIMS === 'true';
var reload = process.env.RELOAD_SW === 'true';
var selfDestroying = process.env.SW_DESTROY === 'true';
//if (process.env.SW === 'true') {
pwaOptions.srcDir = 'src';
pwaOptions.filename = 'claims-sw.ts';
// pwaOptions.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts'
pwaOptions.strategies = 'injectManifest';
pwaOptions.manifest.name = 'PWA Inject Manifest';
pwaOptions.manifest.short_name = 'PWA Inject';
//}
if (claims)
    pwaOptions.registerType = 'autoUpdate';
if (reload) {
    // @ts-expect-error overrides
    replaceOptions.__RELOAD_SW__ = 'true';
}
if (selfDestroying)
    pwaOptions.selfDestroying = selfDestroying;
// export default defineConfig({
//   // base: process.env.BASE_URL || 'https://github.com/',
//   build: {
//     sourcemap: process.env.SOURCE_MAP === 'true',
//   },
//   plugins: [
//     Vue(),
//     VitePWA(pwaOptions),
//     replace(replaceOptions),
//   ],
// })
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
// export const defaultInjectManifestVitePlugins = [
//   'alias',
//   'commonjs',
//   'vite:resolve',
//   'vite:esbuild',
//   'replace',
//   'vite:define',
//   'rollup-plugin-dynamic-import-variables',
//   'vite:esbuild-transpile',
//   'vite:json',
//   'vite:terser',
// ];
var outputPluginStats = function () { return ({
    name: 'output-plugin-stats',
    configResolved: function (config) {
        var plugins = config.plugins.map(function (plugin) { return plugin.name; });
        console.log("Your project has ".concat(plugins.length, " Vite plugins."));
        console.table(plugins);
    }
}); };
var requestAnalytics = function () { return ({
    name: 'request-analytics',
    configureServer: function (server) {
        return function () {
            server.middlewares.use(function (req, res, next) {
                console.log("".concat(req.method.toUpperCase(), " ").concat(req.url));
                next();
            });
        };
    }
}); };
var hotUpdateReport = function () { return ({
    name: 'hot-update-report',
    handleHotUpdate: function (_a) {
        var file = _a.file, timestamp = _a.timestamp, modules = _a.modules;
        console.log("".concat(timestamp, ": ").concat(modules.length, " module(s) updated"));
    }
}); };
var vitePluginWrapper = function () { return ({
    name: 'vite-plugin-wrapper',
    configResolved: function (config) {
        VitePWA(pwaOptions);
    }
}); };
export default defineConfig({
    define: {
        appName: JSON.stringify('vite-sandbox')
    },
    // build: {
    //   emptyOutDir: true,
    //   manifest: true,
    //   minify: false,
    //   polyfillModulePreload: true,
    //   // rollupOptions: {
    //   //   // overwrite default .html entry
    //   //   input: path.resolve(__dirname, './src/lib/index.ts'),
    //   // },
    //   sourcemap: true,
    //   ssr: false,
    //   target: 'es2018',
    // },
    // build: {
    //   //sourcemap: process.env.SOURCE_MAP === 'true',
    //   sourcemap: true,
    //   minify: false,
    //   //lib:true,
    //   // lib: {
    //   //   // Could also be a dictionary or array of multiple entry points
    //   //   entry: "./src/lib/index.js", //resolve(__dirname, 'src/lib/index.js'),
    //   //   name: 'MyLib',
    //   //   // the proper extensions will be added
    //   //   fileName: 'my-lib',
    //   // },
    //   //rollupOptions: {    
    //   //  external: ["crypto", "path"],           
    //   //},
    //   modulePreload:{    
    //     polyfill:false,         
    //   },
    // },       
    // resolve: {
    //   alias: {
    //     //'@' : path.resolve(__dirname, './src'),
    //     // path: `
    //     // const { relative } = require('path');
    //     // export {
    //     //   relative,              
    //     // },
    //     // `
    //     //'resolve' : 'path/resolve',
    //     //"@/": new URL("./src/", import.meta.url).pathname,
    //     //path: "path-browserify",
    //   },
    // },
    plugins: [
        vue(),
        VitePWA(pwaOptions),
        //vitePluginWrapper(),
        outputPluginStats(),
        requestAnalytics(),
        hotUpdateReport(),
        //commonjs( ),
        // //nodeExternals(),
        // replace({
        //   delimiters: ["", ""],
        //   values: {
        //     'process.env.NODE_ENV': JSON.stringify('production'),
        //     //__buildDate__: () => JSON.stringify(new Date()),
        //     //__buildVersion: 15,
        //     __DATE__: new Date().toISOString(),
        //   },
        //   preventAssignment: true,           
        //   }
        // ),
        replace(replaceOptions),
        //replace(),
        // resolve({
        //   path: 
        //     const { relative } = require('path');
        //     export {
        //       relative,              
        //     },
        // }),
    ],
    server: {
        host: true,
        port: 433
    }
});
// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       path: "path-browserify",
//     },
//   },
// })
// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       path: "path-browserify",
//     },
//   },
// })
