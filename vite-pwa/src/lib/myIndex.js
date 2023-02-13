import { createContext } from './context';
for (let i = 1; i <= 7; i++) {
    document.write(i.toString() + '<br>');
}
console.log("All Done");
// const ctx = createContext()
//    MainPlugin(),
export function myVitePWA(userOptions = {}) {
    const ctx = createContext(userOptions);
    // const api = createAPI(ctx)    
    //     return [
    //     MainPlugin(ctx, api),
    //     InfoPlugin(ctx, api),
    //     BuildPlugin(ctx),
    //     DevPlugin(ctx),
    //     ]
}
// export function origVitePWA(userOptions: Partial<VitePWAOptions> = {}): Plugin[] {
//const ctx = createContext(userOptions)
//const api = createAPI(ctx)
//return [
//    MainPlugin(ctx, api),
//    InfoPlugin(ctx, api),
//    BuildPlugin(ctx),
//    DevPlugin(ctx),
//]
// }
export * from './types';
export { cachePreset } from './cache';
export { defaultInjectManifestVitePlugins } from './constants';
//export const hash = Math.floor(Math.random() * 90000) + 10000;
//let count = new SimpleCounter();
//count.count();
//# sourceMappingURL=myIndex.js.map