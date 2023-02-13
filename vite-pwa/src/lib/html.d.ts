import type { ResolvedVitePWAOptions } from './types';
export declare function generateSimpleSWRegister(options: ResolvedVitePWAOptions, dev: boolean): string;
export declare function injectServiceWorker(html: string, options: ResolvedVitePWAOptions, dev: boolean): string;
export declare function generateWebManifest(options: ResolvedVitePWAOptions, dev: boolean): string;
export declare function generateRegisterSW(options: ResolvedVitePWAOptions, dev: boolean): string;
export declare function generateRegisterDevSW(): string;
export declare function generateSWHMR(): string;
