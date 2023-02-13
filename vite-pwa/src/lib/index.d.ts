import type { Plugin } from 'vite';
import type { VitePWAOptions } from './types';
export declare function VitePWA(userOptions?: Partial<VitePWAOptions>): Plugin[];
export * from './types';
export { cachePreset } from './cache';
export { defaultInjectManifestVitePlugins } from './constants';
export type { VitePWAOptions as Options };
