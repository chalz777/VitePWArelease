import type { ResolvedConfig } from 'vite';
import type { ResolvedVitePWAOptions, VitePWAOptions } from './types';
export declare function resolveOptions(options: Partial<VitePWAOptions>, viteConfig: ResolvedConfig): Promise<ResolvedVitePWAOptions>;
