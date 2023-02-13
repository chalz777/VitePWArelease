import type { ResolvedConfig } from 'vite';
import type { ResolvedVitePWAOptions } from './types';
export declare function configureStaticAssets(resolvedVitePWAOptions: ResolvedVitePWAOptions, viteConfig: ResolvedConfig): Promise<void>;
export declare function generateWebManifestFile(options: ResolvedVitePWAOptions): string;
