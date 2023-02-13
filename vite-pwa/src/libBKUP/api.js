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
import { resolve } from 'path';
import { existsSync } from 'fs';
import { generateInjectManifest, generateServiceWorker } from './modules';
import { generateWebManifestFile } from './assets';
import { DEV_SW_NAME, FILE_SW_REGISTER } from './constants';
import { generateRegisterDevSW, generateRegisterSW, generateSimpleSWRegister, generateWebManifest, } from './html';
export function _generateSW(_a) {
    var options = _a.options, viteConfig = _a.viteConfig;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (options.disable)
                        return [2 /*return*/];
                    if (!(options.strategies === 'injectManifest')) return [3 /*break*/, 2];
                    return [4 /*yield*/, generateInjectManifest(options, viteConfig)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, generateServiceWorker(options, viteConfig)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
export function _generateBundle(_a, bundle) {
    var options = _a.options, viteConfig = _a.viteConfig, useImportRegister = _a.useImportRegister;
    if (options.disable || !bundle)
        return;
    if (options.manifest) {
        bundle[options.manifestFilename] = {
            isAsset: true,
            type: 'asset',
            name: undefined,
            source: generateWebManifestFile(options),
            fileName: options.manifestFilename
        };
    }
    // if virtual register is requested, do not inject.
    if (options.injectRegister === 'auto')
        options.injectRegister = useImportRegister ? null : 'script';
    if (options.injectRegister === 'script' && !existsSync(resolve(viteConfig.publicDir, FILE_SW_REGISTER))) {
        bundle[FILE_SW_REGISTER] = {
            isAsset: true,
            type: 'asset',
            name: undefined,
            source: generateSimpleSWRegister(options, false),
            fileName: FILE_SW_REGISTER
        };
    }
    return bundle;
}
export function createAPI(ctx) {
    return {
        get disabled() {
            var _a;
            return (_a = ctx === null || ctx === void 0 ? void 0 : ctx.options) === null || _a === void 0 ? void 0 : _a.disable;
        },
        get pwaInDevEnvironment() {
            return (ctx === null || ctx === void 0 ? void 0 : ctx.devEnvironment) === true;
        },
        webManifestData: function () {
            var _a;
            var options = ctx === null || ctx === void 0 ? void 0 : ctx.options;
            if (!options || options.disable || !options.manifest || (ctx.devEnvironment && !ctx.options.devOptions.enabled))
                return undefined;
            var url = options.manifestFilename;
            var manifest;
            if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
                url = (_a = ctx.options.devOptions.webManifestUrl) !== null && _a !== void 0 ? _a : options.manifestFilename;
                manifest = generateWebManifest(options, true);
            }
            else {
                manifest = generateWebManifest(options, false);
            }
            return {
                href: "".concat(options.base).concat(url),
                useCredentials: ctx.options.useCredentials,
                toLinkTag: function () {
                    return manifest;
                }
            };
        },
        registerSWData: function () {
            var _a;
            // we'll return the info only when it is required
            // 1: exclude if not enabled
            var options = ctx === null || ctx === void 0 ? void 0 : ctx.options;
            if (!options || options.disable || (ctx.devEnvironment && !ctx.options.devOptions.enabled))
                return undefined;
            // 2: if manual registration or using virtual
            var mode = options.injectRegister;
            if (!mode || ctx.useImportRegister)
                return undefined;
            // 3: otherwise we always return the info
            var type = 'classic';
            var script;
            var shouldRegisterSW = options.injectRegister === 'inline' || options.injectRegister === 'script';
            if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
                type = (_a = ctx.options.devOptions.type) !== null && _a !== void 0 ? _a : 'classic';
                script = generateRegisterDevSW();
                shouldRegisterSW = true;
            }
            else if (shouldRegisterSW) {
                script = generateRegisterSW(options, false);
            }
            return {
                // hint when required
                shouldRegisterSW: shouldRegisterSW,
                inline: options.injectRegister === 'inline',
                scope: options.scope,
                inlinePath: "".concat(options.base).concat(ctx.devEnvironment ? DEV_SW_NAME : options.filename),
                registerPath: "".concat(options.base).concat(FILE_SW_REGISTER),
                type: type,
                toScriptTag: function () {
                    return script;
                }
            };
        },
        generateBundle: function (bundle) {
            return _generateBundle(ctx, bundle);
        },
        generateSW: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _generateSW(ctx)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        extendManifestEntries: function (fn) {
            var options = ctx.options;
            if (options.disable)
                return;
            var configField = options.strategies === 'generateSW' ? 'workbox' : 'injectManifest';
            var result = fn(options[configField].additionalManifestEntries || []);
            if (result != null)
                options[configField].additionalManifestEntries = result;
        }
    };
}
