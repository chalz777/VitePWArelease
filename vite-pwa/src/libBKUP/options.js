var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
//import * as fs from 'file-system'
import { extname, resolve } from 'path';
import { configureStaticAssets } from './assets';
import { resolveBathPath } from './utils';
import { defaultInjectManifestVitePlugins } from './constants';
//import { extname, resolve } from 'path'
//const path = require.resolve('path');
function resolveSwPaths(injectManifest, root, srcDir, outDir, filename) {
    var swSrc = resolve(root, srcDir, filename);
    // check typescript service worker: swDest must have js extension
    if (injectManifest && extname(filename) === '.ts' && fs.existsSync(swSrc)) {
        var useFilename = "".concat(filename.substring(0, filename.lastIndexOf('.')), ".js");
        // we need to change filename on resolved options, it will be used to register the service worker:
        // generateSimpleSWRegister on html.ts
        // generateRegisterSW on modules.ts
        return {
            swSrc: swSrc,
            swDest: resolve(root, outDir, useFilename),
            useFilename: useFilename
        };
    }
    return {
        swSrc: swSrc,
        swDest: resolve(root, outDir, filename)
    };
}
export function resolveOptions(options, viteConfig) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var root, pkg, _b, 
        // prevent tsup replacing `process.env`
        // eslint-disable-next-line dot-notation
        mode, _c, srcDir, _d, outDir, _e, injectRegister, _f, registerType, _g, filename, _h, manifestFilename, _j, strategies, _k, minify, _l, base, _m, includeAssets, _o, includeManifestIcons, _p, useCredentials, _q, disable, _r, devOptions, _s, selfDestroying, _t, integration, basePath, _u, swSrc, swDest, useFilename, outDirRoot, scope, defaultWorkbox, defaultInjectManifest, defaultManifest, workbox, manifest, _v, _w, vitePlugins, _x, rollupFormat, userInjectManifest, injectManifest, sourcemap, resolvedVitePWAOptions;
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0:
                    root = viteConfig.root;
                    pkg = fs.existsSync('package.json')
                        ? JSON.parse(fs.readFileSync('package.json', 'utf-8'))
                        : {};
                    _b = options.mode, mode = _b === void 0 ? (process['env']['NODE_ENV'] || 'production') : _b, _c = options.srcDir, srcDir = _c === void 0 ? 'public' : _c, _d = options.outDir, outDir = _d === void 0 ? viteConfig.build.outDir || 'dist' : _d, _e = options.injectRegister, injectRegister = _e === void 0 ? 'auto' : _e, _f = options.registerType, registerType = _f === void 0 ? 'prompt' : _f, _g = options.filename, filename = _g === void 0 ? 'sw.js' : _g, _h = options.manifestFilename, manifestFilename = _h === void 0 ? 'manifest.webmanifest' : _h, _j = options.strategies, strategies = _j === void 0 ? 'generateSW' : _j, _k = options.minify, minify = _k === void 0 ? true : _k, _l = options.base, base = _l === void 0 ? viteConfig.base : _l, _m = options.includeAssets, includeAssets = _m === void 0 ? undefined : _m, _o = options.includeManifestIcons, includeManifestIcons = _o === void 0 ? true : _o, _p = options.useCredentials, useCredentials = _p === void 0 ? false : _p, _q = options.disable, disable = _q === void 0 ? false : _q, _r = options.devOptions, devOptions = _r === void 0 ? { enabled: false, type: 'classic' } : _r, _s = options.selfDestroying, selfDestroying = _s === void 0 ? false : _s, _t = options.integration, integration = _t === void 0 ? {} : _t;
                    basePath = resolveBathPath(base);
                    _u = resolveSwPaths(strategies === 'injectManifest', root, srcDir, outDir, filename), swSrc = _u.swSrc, swDest = _u.swDest, useFilename = _u.useFilename;
                    outDirRoot = resolve(root, outDir);
                    scope = options.scope || basePath;
                    defaultWorkbox = {
                        swDest: swDest,
                        globDirectory: outDirRoot,
                        offlineGoogleAnalytics: false,
                        cleanupOutdatedCaches: true,
                        dontCacheBustURLsMatching: /\.[a-f0-9]{8}\./,
                        mode: mode,
                        navigateFallback: 'index.html'
                    };
                    defaultInjectManifest = {
                        swSrc: swSrc,
                        swDest: swDest,
                        globDirectory: outDirRoot,
                        dontCacheBustURLsMatching: /\.[a-f0-9]{8}\./,
                        injectionPoint: 'self.__WB_MANIFEST'
                    };
                    defaultManifest = {
                        name: pkg.name,
                        short_name: pkg.name,
                        start_url: basePath,
                        display: 'standalone',
                        background_color: '#ffffff',
                        lang: 'en',
                        scope: scope
                    };
                    workbox = Object.assign({}, defaultWorkbox, options.workbox || {});
                    manifest = typeof options.manifest === 'boolean' && !options.manifest
                        ? false
                        : Object.assign({}, defaultManifest, options.manifest || {});
                    _v = options.injectManifest || {}, _w = _v.vitePlugins, vitePlugins = _w === void 0 ? defaultInjectManifestVitePlugins : _w, _x = _v.rollupFormat, rollupFormat = _x === void 0 ? 'es' : _x, userInjectManifest = __rest(_v, ["vitePlugins", "rollupFormat"]);
                    injectManifest = Object.assign({}, defaultInjectManifest, userInjectManifest);
                    if ((injectRegister === 'auto' || injectRegister == null) && registerType === 'autoUpdate') {
                        workbox.skipWaiting = true;
                        workbox.clientsClaim = true;
                    }
                    // use vite build.sourcemap to configure `generateSW` sourcemap
                    if (strategies === 'generateSW' && workbox.sourcemap === undefined) {
                        sourcemap = (_a = viteConfig.build) === null || _a === void 0 ? void 0 : _a.sourcemap;
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
                    resolvedVitePWAOptions = {
                        base: basePath,
                        mode: mode,
                        swSrc: swSrc,
                        swDest: swDest,
                        srcDir: srcDir,
                        outDir: outDir,
                        injectRegister: injectRegister,
                        registerType: registerType,
                        filename: useFilename || filename,
                        manifestFilename: manifestFilename,
                        strategies: strategies,
                        workbox: workbox,
                        manifest: manifest,
                        useCredentials: useCredentials,
                        injectManifest: injectManifest,
                        scope: scope,
                        minify: minify,
                        includeAssets: includeAssets,
                        includeManifestIcons: includeManifestIcons,
                        disable: disable,
                        integration: integration,
                        devOptions: devOptions,
                        rollupFormat: rollupFormat,
                        vitePlugins: vitePlugins,
                        selfDestroying: selfDestroying
                    };
                    return [4 /*yield*/, configureStaticAssets(resolvedVitePWAOptions, viteConfig)];
                case 1:
                    _y.sent();
                    return [2 /*return*/, resolvedVitePWAOptions];
            }
        });
    });
}
