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
import { resolve as resolveFs } from 'path';
import fs from 'fs';
import * as crypto from 'crypto';
//import { crypto } from 'crypto'
import fg from 'fast-glob';
function buildManifestEntry(publicDir, url) {
    return new Promise(function (resolve, reject) {
        var cHash = crypto.createHash('MD5');
        var stream = fs.createReadStream(resolveFs(publicDir, url));
        stream.on('error', function (err) {
            reject(err);
        });
        stream.on('data', function (chunk) {
            cHash.update(chunk);
        });
        stream.on('end', function () {
            return resolve({
                url: url,
                revision: "".concat(cHash.digest('hex'))
            });
        });
    });
}
function lookupAdditionalManifestEntries(useInjectManifest, injectManifest, workbox) {
    return useInjectManifest
        ? injectManifest.additionalManifestEntries || []
        : workbox.additionalManifestEntries || [];
}
// we need to make icons relative, we can have for example icon entries with: /pwa.png
// fast-glob will not resolve absolute paths
function normalizeIconPath(path) {
    return path.startsWith('/') ? path.substring(1) : path;
}
function includeIcons(icons, globs) {
    Object.keys(icons).forEach(function (key) {
        var icon = icons[key];
        var src = normalizeIconPath(icon.src);
        if (!globs.includes(src))
            globs.push(src);
    });
}
export function configureStaticAssets(resolvedVitePWAOptions, viteConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var manifest, strategies, injectManifest, workbox, includeAssets, includeManifestIcons, manifestFilename, useInjectManifest, publicDir, globs, manifestEntries, assets, included_1, assetsEntries, cHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manifest = resolvedVitePWAOptions.manifest, strategies = resolvedVitePWAOptions.strategies, injectManifest = resolvedVitePWAOptions.injectManifest, workbox = resolvedVitePWAOptions.workbox, includeAssets = resolvedVitePWAOptions.includeAssets, includeManifestIcons = resolvedVitePWAOptions.includeManifestIcons, manifestFilename = resolvedVitePWAOptions.manifestFilename;
                    useInjectManifest = strategies === 'injectManifest';
                    publicDir = viteConfig.publicDir;
                    globs = [];
                    manifestEntries = lookupAdditionalManifestEntries(useInjectManifest, injectManifest, workbox);
                    if (includeAssets) {
                        // we need to make icons relative, we can have for example icon entries with: /pwa.png
                        // fast-glob will not resolve absolute paths
                        if (Array.isArray(includeAssets))
                            globs.push.apply(globs, includeAssets.map(normalizeIconPath));
                        else
                            globs.push(normalizeIconPath(includeAssets));
                    }
                    if (includeManifestIcons && manifest) {
                        manifest.icons && includeIcons(manifest.icons, globs);
                        manifest.shortcuts && manifest.shortcuts.forEach(function (s) {
                            s.icons && includeIcons(s.icons, globs);
                        });
                    }
                    if (!(globs.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, fg(globs, {
                            cwd: publicDir,
                            onlyFiles: true,
                            unique: true
                        })
                        // we also need to remove from the list existing included by the user
                    ];
                case 1:
                    assets = _a.sent();
                    // we also need to remove from the list existing included by the user
                    if (manifestEntries.length > 0) {
                        included_1 = manifestEntries.map(function (me) {
                            if (typeof me === 'string')
                                return me;
                            else
                                return me.url;
                        });
                        assets = assets.filter(function (a) { return !included_1.includes(a); });
                    }
                    return [4 /*yield*/, Promise.all(assets.map(function (a) {
                            return buildManifestEntry(publicDir, a);
                        }))];
                case 2:
                    assetsEntries = _a.sent();
                    manifestEntries.push.apply(manifestEntries, assetsEntries);
                    _a.label = 3;
                case 3:
                    if (manifest) {
                        cHash = crypto.createHash('MD5');
                        cHash.update(generateWebManifestFile(resolvedVitePWAOptions));
                        manifestEntries.push({
                            url: manifestFilename,
                            revision: "".concat(cHash.digest('hex'))
                        });
                    }
                    if (manifestEntries.length > 0) {
                        if (useInjectManifest)
                            injectManifest.additionalManifestEntries = manifestEntries;
                        else
                            workbox.additionalManifestEntries = manifestEntries;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
export function generateWebManifestFile(options) {
    return "".concat(JSON.stringify(options.manifest, null, options.minify ? 0 : 2), "\n");
}
