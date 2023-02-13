import { resolve } from 'path';
import { existsSync } from 'fs';
import { generateInjectManifest, generateServiceWorker } from './modules';
import { generateWebManifestFile } from './assets';
import { DEV_SW_NAME, FILE_SW_REGISTER } from './constants';
import { generateRegisterDevSW, generateRegisterSW, generateSimpleSWRegister, generateWebManifest, } from './html';
export async function _generateSW({ options, viteConfig }) {
    if (options.disable)
        return;
    if (options.strategies === 'injectManifest')
        await generateInjectManifest(options, viteConfig);
    else
        await generateServiceWorker(options, viteConfig);
}
export function _generateBundle({ options, viteConfig, useImportRegister }, bundle) {
    if (options.disable || !bundle)
        return;
    if (options.manifest) {
        bundle[options.manifestFilename] = {
            isAsset: true,
            type: 'asset',
            name: undefined,
            source: generateWebManifestFile(options),
            fileName: options.manifestFilename,
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
            fileName: FILE_SW_REGISTER,
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
        webManifestData() {
            var _a;
            const options = ctx === null || ctx === void 0 ? void 0 : ctx.options;
            if (!options || options.disable || !options.manifest || (ctx.devEnvironment && !ctx.options.devOptions.enabled))
                return undefined;
            let url = options.manifestFilename;
            let manifest;
            if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
                url = (_a = ctx.options.devOptions.webManifestUrl) !== null && _a !== void 0 ? _a : options.manifestFilename;
                manifest = generateWebManifest(options, true);
            }
            else {
                manifest = generateWebManifest(options, false);
            }
            return {
                href: `${options.base}${url}`,
                useCredentials: ctx.options.useCredentials,
                toLinkTag() {
                    return manifest;
                },
            };
        },
        registerSWData() {
            var _a;
            // we'll return the info only when it is required
            // 1: exclude if not enabled
            const options = ctx === null || ctx === void 0 ? void 0 : ctx.options;
            if (!options || options.disable || (ctx.devEnvironment && !ctx.options.devOptions.enabled))
                return undefined;
            // 2: if manual registration or using virtual
            const mode = options.injectRegister;
            if (!mode || ctx.useImportRegister)
                return undefined;
            // 3: otherwise we always return the info
            let type = 'classic';
            let script;
            let shouldRegisterSW = options.injectRegister === 'inline' || options.injectRegister === 'script';
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
                shouldRegisterSW,
                inline: options.injectRegister === 'inline',
                scope: options.scope,
                inlinePath: `${options.base}${ctx.devEnvironment ? DEV_SW_NAME : options.filename}`,
                registerPath: `${options.base}${FILE_SW_REGISTER}`,
                type,
                toScriptTag() {
                    return script;
                },
            };
        },
        generateBundle(bundle) {
            return _generateBundle(ctx, bundle);
        },
        async generateSW() {
            return await _generateSW(ctx);
        },
        extendManifestEntries(fn) {
            const { options } = ctx;
            if (options.disable)
                return;
            const configField = options.strategies === 'generateSW' ? 'workbox' : 'injectManifest';
            const result = fn(options[configField].additionalManifestEntries || []);
            if (result != null)
                options[configField].additionalManifestEntries = result;
        },
    };
}
//# sourceMappingURL=api.js.map