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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { dirname, resolve } from 'path';
//import { readFile, promises as fs, writeFile } from 'file-system'
import { promises as fs } from 'fs';
//import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url';
import { logWorkboxResult } from './log';
import { defaultInjectManifestVitePlugins } from './constants';
//const url = require('url');
//const path = require.resolve('path');
//const url = require.resolve('url');
var _dirname = typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url));
function loadWorkboxBuild() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var workbox, _1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, import('workbox-build')];
                case 1:
                    workbox = _b.sent();
                    return [2 /*return*/, (_a = workbox["default"]) !== null && _a !== void 0 ? _a : workbox];
                case 2:
                    _1 = _b.sent();
                    return [2 /*return*/, require('workbox-build')];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function loadRollupReplacePlugin() {
    return __awaiter(this, void 0, void 0, function () {
        var createRequire, nodeRequire, _2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, import('module').then(function (m) { return m["default"] || m; })];
                case 1:
                    createRequire = (_a.sent()).createRequire;
                    nodeRequire = createRequire(_dirname);
                    return [2 /*return*/, nodeRequire('@rollup/plugin-replace')];
                case 2:
                    _2 = _a.sent();
                    return [2 /*return*/, require('@rollup/plugin-replace')];
                case 3: return [2 /*return*/];
            }
        });
    });
}
export function generateRegisterSW(options, mode, source) {
    if (source === void 0) { source = 'register'; }
    return __awaiter(this, void 0, void 0, function () {
        var sw, scope, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sw = options.base + options.filename;
                    scope = options.scope;
                    return [4 /*yield*/, fs.readFile(resolve(_dirname, "client/".concat(mode, "/").concat(source, ".mjs")), 'utf-8')];
                case 1:
                    content = _a.sent();
                    return [2 /*return*/, content
                            .replace(/__SW__/g, sw)
                            .replace('__SCOPE__', scope)
                            .replace('__SW_AUTO_UPDATE__', "".concat(options.registerType === 'autoUpdate'))
                            .replace('__SW_SELF_DESTROYING__', "".concat(options.selfDestroying))
                            .replace('__TYPE__', "".concat(options.devOptions.enabled ? options.devOptions.type : 'classic'))];
            }
        });
    });
}
export function generateServiceWorker(options, viteOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var selfDestroyingSW, generateSW, buildResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!options.selfDestroying) return [3 /*break*/, 2];
                    selfDestroyingSW = "\nself.addEventListener('install', function(e) {\n  self.skipWaiting();\n});\nself.addEventListener('activate', function(e) {\n  self.registration.unregister()\n    .then(function() {\n      return self.clients.matchAll();\n    })\n    .then(function(clients) {\n      clients.forEach(client => client.navigate(client.url))\n    });\n});\n    ";
                    return [4 /*yield*/, fs.writeFile(options.swDest.replace(/\\/g, '/'), selfDestroyingSW, { encoding: 'utf8' })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            count: 1,
                            size: selfDestroyingSW.length,
                            warnings: [],
                            filePaths: [options.filename]
                        }];
                case 2: return [4 /*yield*/, loadWorkboxBuild()
                    // generate the service worker
                ];
                case 3:
                    generateSW = (_a.sent()).generateSW;
                    return [4 /*yield*/, generateSW(options.workbox)
                        // log workbox result
                    ];
                case 4:
                    buildResult = _a.sent();
                    // log workbox result
                    logWorkboxResult('generateSW', buildResult, viteOptions);
                    return [2 /*return*/, buildResult];
            }
        });
    });
}
export function generateInjectManifest(options, viteOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var selfDestroying, vitePlugins, includedPluginNames, replace, plugins, rollup, bundle, injectManifestOptions, injectManifest, buildResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selfDestroying = options.selfDestroying;
                    if (!selfDestroying) return [3 /*break*/, 2];
                    return [4 /*yield*/, generateServiceWorker(options, viteOptions)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2:
                    vitePlugins = options.vitePlugins;
                    includedPluginNames = [];
                    console.log("vitePlugins: " + vitePlugins);
                    if (typeof vitePlugins === 'function')
                        includedPluginNames.push.apply(includedPluginNames, vitePlugins(viteOptions.plugins.map(function (p) { return p.name; })));
                    else
                        includedPluginNames.push.apply(includedPluginNames, vitePlugins);
                    if (includedPluginNames.length === 0)
                        includedPluginNames.push.apply(includedPluginNames, defaultInjectManifestVitePlugins);
                    return [4 /*yield*/, loadRollupReplacePlugin()];
                case 3:
                    replace = _a.sent();
                    console.log("replace: " + replace);
                    plugins = __spreadArray([
                        replace({
                            'jerry': 'creere',
                            'preventAssignment': true,
                            'process.env.NODE_ENV': JSON.stringify(options.mode)
                        })
                    ], viteOptions.plugins.filter(function (p) { return includedPluginNames.includes(p.name); }), true);
                    return [4 /*yield*/, import('rollup')];
                case 4:
                    rollup = (_a.sent()).rollup;
                    return [4 /*yield*/, rollup({
                            input: options.swSrc,
                            plugins: plugins
                        })];
                case 5:
                    bundle = _a.sent();
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, , 8, 10]);
                    console.log("module:swDest " + options.injectManifest.swDest);
                    return [4 /*yield*/, bundle.write({
                            format: options.rollupFormat,
                            exports: 'none',
                            inlineDynamicImports: true,
                            file: options.injectManifest.swDest,
                            sourcemap: viteOptions.build.sourcemap
                        })];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, bundle.close()];
                case 9:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 10:
                    injectManifestOptions = __assign(__assign({}, options.injectManifest), { 
                        // this will not fail since there is an injectionPoint
                        swSrc: options.injectManifest.swDest });
                    return [4 /*yield*/, loadWorkboxBuild()
                        // inject the manifest
                    ];
                case 11:
                    injectManifest = (_a.sent()).injectManifest;
                    return [4 /*yield*/, injectManifest(injectManifestOptions)
                        // log workbox result
                    ];
                case 12:
                    buildResult = _a.sent();
                    // log workbox result
                    logWorkboxResult('injectManifest', buildResult, viteOptions);
                    return [2 /*return*/];
            }
        });
    });
}
