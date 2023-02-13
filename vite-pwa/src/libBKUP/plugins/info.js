import { PWA_INFO_VIRTUAL, RESOLVED_PWA_INFO_VIRTUAL, } from '../constants';
export function InfoPlugin(ctx, api) {
    return {
        name: 'vite-sandbox:info',
        enforce: 'post',
        resolveId: function (id) {
            if (id === PWA_INFO_VIRTUAL)
                return RESOLVED_PWA_INFO_VIRTUAL;
            return undefined;
        },
        load: function (id) {
            if (id === RESOLVED_PWA_INFO_VIRTUAL)
                return generatePwaInfo(ctx, api);
        }
    };
}
function generatePwaInfo(ctx, api) {
    var webManifestData = api.webManifestData();
    if (!webManifestData)
        return 'export const pwaInfo = undefined;';
    var href = webManifestData.href, useCredentials = webManifestData.useCredentials, toLinkTag = webManifestData.toLinkTag;
    var registerSWData = api.registerSWData();
    var entry = {
        pwaInDevEnvironment: api.pwaInDevEnvironment,
        webManifest: {
            href: href,
            useCredentials: useCredentials,
            linkTag: toLinkTag()
        }
    };
    if (registerSWData) {
        var scriptTag = registerSWData.toScriptTag();
        if (scriptTag) {
            var inline = registerSWData.inline, inlinePath = registerSWData.inlinePath, registerPath = registerSWData.registerPath, type = registerSWData.type, scope = registerSWData.scope;
            entry.registerSW = {
                inline: inline,
                inlinePath: inlinePath,
                registerPath: registerPath,
                type: type,
                scope: scope,
                scriptTag: scriptTag
            };
        }
    }
    return "export const pwaInfo = ".concat(JSON.stringify(entry), ";");
}
