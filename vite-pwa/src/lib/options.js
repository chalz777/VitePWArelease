var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import fs from 'fs';
import { extname, resolve } from 'path';
import { configureStaticAssets } from './assets';
import { resolveBathPath } from './utils';
import { defaultInjectManifestVitePlugins } from './constants';
function resolveSwPaths(injectManifest, root, srcDir, outDir, filename) {
    const swSrc = resolve(root, srcDir, filename);
    // check typescript service worker: swDest must have js extension
    if (injectManifest && extname(filename) === '.ts' && fs.existsSync(swSrc)) {
        const useFilename = `${filename.substring(0, filename.lastIndexOf('.'))}.js`;
        // we need to change filename on resolved options, it will be used to register the service worker:
        // generateSimpleSWRegister on html.ts
        // generateRegisterSW on modules.ts
        return {
            swSrc,
            swDest: resolve(root, outDir, useFilename),
            useFilename,
        };
    }
    return {
        swSrc,
        swDest: resolve(root, outDir, filename),
    };
}
export async function resolveOptions(options, viteConfig) {
    var _a;
    const root = viteConfig.root;
    const pkg = fs.existsSync('package.json')
        ? JSON.parse(fs.readFileSync('package.json', 'utf-8'))
        : {};
    const { 
    // prevent tsup replacing `process.env`
    // eslint-disable-next-line dot-notation
    mode = (process['env']['NODE_ENV'] || 'production'), srcDir = 'public', outDir = viteConfig.build.outDir || 'dist', injectRegister = 'auto', registerType = 'prompt', filename = 'sw.js', manifestFilename = 'manifest.webmanifest', strategies = 'generateSW', minify = true, base = viteConfig.base, includeAssets = undefined, includeManifestIcons = true, useCredentials = false, disable = false, devOptions = { enabled: false, type: 'classic' }, selfDestroying = false, integration = {}, } = options;
    const basePath = resolveBathPath(base);
    // check typescript service worker for injectManifest strategy
    const { swSrc, swDest, useFilename } = resolveSwPaths(strategies === 'injectManifest', root, srcDir, outDir, filename);
    const outDirRoot = resolve(root, outDir);
    const scope = options.scope || basePath;
    const defaultWorkbox = {
        swDest,
        globDirectory: outDirRoot,
        offlineGoogleAnalytics: false,
        cleanupOutdatedCaches: true,
        dontCacheBustURLsMatching: /\.[a-f0-9]{8}\./,
        mode,
        navigateFallback: 'index.html',
    };
    const defaultInjectManifest = {
        swSrc,
        swDest,
        globDirectory: outDirRoot,
        dontCacheBustURLsMatching: /\.[a-f0-9]{8}\./,
        injectionPoint: 'self.__WB_MANIFEST',
    };
    const defaultManifest = {
        name: pkg.name,
        short_name: pkg.name,
        start_url: basePath,
        display: 'standalone',
        background_color: '#ffffff',
        lang: 'en',
        scope,
    };
    const workbox = Object.assign({}, defaultWorkbox, options.workbox || {});
    const manifest = typeof options.manifest === 'boolean' && !options.manifest
        ? false
        : Object.assign({}, defaultManifest, options.manifest || {});
    const _b = options.injectManifest || {}, { vitePlugins = defaultInjectManifestVitePlugins, rollupFormat = 'es' } = _b, userInjectManifest = __rest(_b, ["vitePlugins", "rollupFormat"]);
    const injectManifest = Object.assign({}, defaultInjectManifest, userInjectManifest);
    if ((injectRegister === 'auto' || injectRegister == null) && registerType === 'autoUpdate') {
        workbox.skipWaiting = true;
        workbox.clientsClaim = true;
    }
    // use vite build.sourcemap to configure `generateSW` sourcemap
    if (strategies === 'generateSW' && workbox.sourcemap === undefined) {
        const sourcemap = (_a = viteConfig.build) === null || _a === void 0 ? void 0 : _a.sourcemap;
        workbox.sourcemap = sourcemap === true || sourcemap === 'inline' || sourcemap === 'hidden';
    }
    if (devOptions.enabled && viteConfig.command === 'serve') {
        // `generateSW` will work only with `type: 'classic'`
        if (strategies === 'generateSW')
            devOptions.type = 'classic';
    }
    else {
        devOptions.enabled = false;
        devOptions.type = 'classic';
    }
    const resolvedVitePWAOptions = {
        base: basePath,
        mode,
        swSrc,
        swDest,
        srcDir,
        outDir,
        injectRegister,
        registerType,
        filename: useFilename || filename,
        manifestFilename,
        strategies,
        workbox,
        manifest,
        useCredentials,
        injectManifest,
        scope,
        minify,
        includeAssets,
        includeManifestIcons,
        disable,
        integration,
        devOptions,
        rollupFormat,
        vitePlugins,
        selfDestroying,
    };
    await configureStaticAssets(resolvedVitePWAOptions, viteConfig);
    return resolvedVitePWAOptions;
}
//# sourceMappingURL=options.js.map