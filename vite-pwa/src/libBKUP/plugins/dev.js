var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { basename, resolve } from 'path';
//import * as path from 'path'
//import { existsSync, promises as fs, mkdirSync } from 'file-system'
import { existsSync, promises as fs, mkdirSync } from 'fs';
import { generateRegisterDevSW, generateSWHMR, generateSimpleSWRegister, injectServiceWorker, } from '../html';
import { generateWebManifestFile } from '../assets';
import { DEV_READY_NAME, DEV_REGISTER_SW_NAME, DEV_SW_NAME, DEV_SW_VIRTUAL, FILE_SW_REGISTER, RESOLVED_DEV_SW_VIRTUAL, } from '../constants';
import { generateServiceWorker } from '../modules';
import { normalizePath } from '../utils';
export var swDevOptions = {
    swUrl: DEV_SW_NAME,
    swDevGenerated: false,
    workboxPaths: new Map()
};
export function DevPlugin(ctx) {
    return {
        name: 'vite-sandbox:dev-sw',
        apply: 'serve',
        transformIndexHtml: {
            enforce: 'post',
            transform: function (html) {
                return __awaiter(this, void 0, void 0, function () {
                    var options;
                    return __generator(this, function (_a) {
                        options = ctx.options;
                        if (options.disable || !options.manifest || !options.devOptions.enabled)
                            return [2 /*return*/, html];
                        html = injectServiceWorker(html, options, true);
                        return [2 /*return*/, html.replace('</body>', "".concat(generateRegisterDevSW(), "\n</body>"))];
                    });
                });
            }
        },
        configureServer: function (server) {
            var _a;
            ctx.devEnvironment = true;
            var options = ctx.options;
            if (!options.disable && options.manifest && options.devOptions.enabled) {
                server.ws.on(DEV_READY_NAME, createSWResponseHandler(server, ctx));
                var name_1 = (_a = options.devOptions.webManifestUrl) !== null && _a !== void 0 ? _a : "".concat(options.base).concat(options.manifestFilename);
                server.middlewares.use(function (req, res, next) {
                    if (req.url === name_1) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/manifest+json');
                        res.write(generateWebManifestFile(options), 'utf-8');
                        res.end();
                    }
                    else {
                        next();
                    }
                });
            }
        },
        resolveId: function (id) {
            if (id === DEV_SW_VIRTUAL)
                return RESOLVED_DEV_SW_VIRTUAL;
            var options = ctx.options;
            if (!options.disable && options.devOptions.enabled && options.strategies === 'injectManifest' && !options.selfDestroying) {
                var name_2 = id.startsWith('/') ? id.slice(1) : id;
                // the sw must be registered with .js extension on browser, here we detect that request:
                // - the .js file and source with .ts, or
                // - the .ts source file
                // in both cases we need to resolve the id to the source file to load it and add empty injection point on loadDev
                // we need to always return the path to source file name to resolve imports on the sw
                return name_2 === swDevOptions.swUrl || name_2 === options.injectManifest.swSrc
                    ? options.injectManifest.swSrc
                    : undefined;
            }
            return undefined;
        },
        load: function (id) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var options, viteConfig, swSrc, content, resolvedIP, ip, navigateFallback, globDirectory, swDest, navigateFallback, filePaths, key;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (id === RESOLVED_DEV_SW_VIRTUAL)
                                return [2 /*return*/, generateSWHMR()];
                            options = ctx.options, viteConfig = ctx.viteConfig;
                            if (!(!options.disable && options.devOptions.enabled)) return [3 /*break*/, 11];
                            if (!(options.strategies === 'injectManifest' && !options.selfDestroying)) return [3 /*break*/, 5];
                            swSrc = normalizePath(options.injectManifest.swSrc);
                            if (!(id === swSrc)) return [3 /*break*/, 2];
                            return [4 /*yield*/, fs.readFile(options.injectManifest.swSrc, 'utf-8')];
                        case 1:
                            content = _b.sent();
                            resolvedIP = options.injectManifest.injectionPoint;
                            if (resolvedIP) {
                                ip = new RegExp(resolvedIP, 'g');
                                navigateFallback = options.devOptions.navigateFallback;
                                // we only add the navigateFallback if using registerRoute for offline support on custom sw
                                if (navigateFallback)
                                    content = content.replace(ip, "[{ url: '".concat(navigateFallback, "' }]"));
                                else
                                    content = content.replace(ip, '[]');
                            }
                            return [2 /*return*/, content];
                        case 2:
                            if (!swDevOptions.workboxPaths.has(id)) return [3 /*break*/, 4];
                            return [4 /*yield*/, fs.readFile(swDevOptions.workboxPaths.get(id), 'utf-8')];
                        case 3: return [2 /*return*/, _b.sent()];
                        case 4: return [2 /*return*/, undefined];
                        case 5:
                            if (!id.endsWith(swDevOptions.swUrl)) return [3 /*break*/, 9];
                            globDirectory = resolve(viteConfig.root, 'dev-dist');
                            if (!existsSync(globDirectory))
                                mkdirSync(globDirectory);
                            swDest = resolve(globDirectory, 'sw.js');
                            if (!(!swDevOptions.swDevGenerated || !existsSync(swDest))) return [3 /*break*/, 7];
                            navigateFallback = options.workbox.navigateFallback;
                            return [4 /*yield*/, generateServiceWorker(Object.assign({}, options, {
                                    swDest: options.selfDestroying ? swDest : options.swDest,
                                    workbox: __assign(__assign({}, options.workbox), { navigateFallbackAllowlist: (_a = options.devOptions.navigateFallbackAllowlist) !== null && _a !== void 0 ? _a : [/^\/$/], runtimeCaching: options.devOptions.disableRuntimeConfig ? undefined : options.workbox.runtimeCaching, 
                                        // we only include navigateFallback
                                        additionalManifestEntries: navigateFallback ? [navigateFallback] : undefined, cleanupOutdatedCaches: true, globDirectory: globDirectory.replace(/\\/g, '/'), swDest: swDest.replace(/\\/g, '/') })
                                }), viteConfig)
                                // we store workbox dependencies, and so we can then resolve them when requested: at least workbox-**.js
                            ];
                        case 6:
                            filePaths = (_b.sent()).filePaths;
                            // we store workbox dependencies, and so we can then resolve them when requested: at least workbox-**.js
                            filePaths.forEach(function (we) {
                                var name = basename(we);
                                // we exclude the sw itself
                                if (name !== 'sw.js')
                                    swDevOptions.workboxPaths.set(normalizePath("".concat(options.base).concat(name)), we);
                            });
                            swDevOptions.swDevGenerated = true;
                            _b.label = 7;
                        case 7: return [4 /*yield*/, fs.readFile(swDest, 'utf-8')];
                        case 8: return [2 /*return*/, _b.sent()];
                        case 9:
                            key = normalizePath("".concat(options.base).concat(id.startsWith('/') ? id.slice(1) : id));
                            if (!swDevOptions.workboxPaths.has(key)) return [3 /*break*/, 11];
                            return [4 /*yield*/, fs.readFile(swDevOptions.workboxPaths.get(key), 'utf-8')];
                        case 10: return [2 /*return*/, _b.sent()];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        }
    };
}
function createDevRegisterSW(options, viteConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var devDist, registerSW;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(options.injectRegister === 'script')) return [3 /*break*/, 2];
                    devDist = resolve(viteConfig.root, 'dev-dist');
                    if (!existsSync(devDist))
                        mkdirSync(devDist);
                    registerSW = resolve(devDist, FILE_SW_REGISTER);
                    if (existsSync(registerSW)) {
                        // since we don't delete the dev-dist folder, we just add it if already exists
                        if (!swDevOptions.workboxPaths.has(registerSW))
                            swDevOptions.workboxPaths.set(normalizePath("".concat(options.base).concat(FILE_SW_REGISTER)), registerSW);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fs.writeFile(registerSW, generateSimpleSWRegister(options, true), { encoding: 'utf8' })];
                case 1:
                    _a.sent();
                    swDevOptions.workboxPaths.set(normalizePath("".concat(options.base).concat(FILE_SW_REGISTER)), registerSW);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function createSWResponseHandler(server, ctx) {
    var _this = this;
    return function () { return __awaiter(_this, void 0, void 0, function () {
        var options, useImportRegister, injectRegister, scope, base;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = ctx.options, useImportRegister = ctx.useImportRegister;
                    injectRegister = options.injectRegister, scope = options.scope, base = options.base;
                    if (!(!useImportRegister && injectRegister)) return [3 /*break*/, 2];
                    if (injectRegister === 'auto')
                        options.injectRegister = 'script';
                    return [4 /*yield*/, createDevRegisterSW(options, ctx.viteConfig)];
                case 1:
                    _a.sent();
                    server.ws.send({
                        type: 'custom',
                        event: DEV_REGISTER_SW_NAME,
                        data: {
                            inline: options.injectRegister === 'inline',
                            scope: scope,
                            inlinePath: "".concat(base).concat(DEV_SW_NAME),
                            registerPath: "".concat(base).concat(FILE_SW_REGISTER),
                            swType: options.devOptions.type
                        }
                    });
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
}
