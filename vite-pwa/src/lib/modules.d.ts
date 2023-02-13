import type { BuildResult } from 'workbox-build';
import type { ResolvedConfig } from 'vite';
import type { ResolvedVitePWAOptions } from './types';
export declare function generateRegisterSW(options: ResolvedVitePWAOptions, mode: 'build' | 'dev', source?: string): Promise<string>;
export declare function generateServiceWorker(options: ResolvedVitePWAOptions, viteOptions: ResolvedConfig): Promise<BuildResult>;
export declare function generateInjectManifest(options: ResolvedVitePWAOptions, viteOptions: ResolvedConfig): Promise<void>;
