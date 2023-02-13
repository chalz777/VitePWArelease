import { createContext } from './context';
import { BuildPlugin } from './plugins/build';
import { DevPlugin } from './plugins/dev';
import { MainPlugin } from './plugins/main';
import { InfoPlugin } from './plugins/info';
import { createAPI } from './api';
export function VitePWA(userOptions = {}) {
    const ctx = createContext(userOptions);
    const api = createAPI(ctx);
    return [
        MainPlugin(ctx, api),
        InfoPlugin(ctx, api),
        BuildPlugin(ctx),
        DevPlugin(ctx),
    ];
}
export * from './types';
export { cachePreset } from './cache';
export { defaultInjectManifestVitePlugins } from './constants';
//# sourceMappingURL=index.js.map