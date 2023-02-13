import { PWA_INFO_VIRTUAL, RESOLVED_PWA_INFO_VIRTUAL, } from '../constants';
export function InfoPlugin(ctx, api) {
    return {
        name: 'vite-plugin-pwa:info',
        enforce: 'post',
        resolveId(id) {
            if (id === PWA_INFO_VIRTUAL)
                return RESOLVED_PWA_INFO_VIRTUAL;
            return undefined;
        },
        load(id) {
            if (id === RESOLVED_PWA_INFO_VIRTUAL)
                return generatePwaInfo(ctx, api);
        },
    };
}
function generatePwaInfo(ctx, api) {
    const webManifestData = api.webManifestData();
    if (!webManifestData)
        return 'export const pwaInfo = undefined;';
    const { href, useCredentials, toLinkTag } = webManifestData;
    const registerSWData = api.registerSWData();
    const entry = {
        pwaInDevEnvironment: api.pwaInDevEnvironment,
        webManifest: {
            href,
            useCredentials,
            linkTag: toLinkTag(),
        },
    };
    if (registerSWData) {
        const scriptTag = registerSWData.toScriptTag();
        if (scriptTag) {
            const { inline, inlinePath, registerPath, type, scope } = registerSWData;
            entry.registerSW = {
                inline,
                inlinePath,
                registerPath,
                type,
                scope,
                scriptTag,
            };
        }
    }
    return `export const pwaInfo = ${JSON.stringify(entry)};`;
}
//# sourceMappingURL=info.js.map