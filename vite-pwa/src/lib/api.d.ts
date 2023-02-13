import type { OutputBundle } from 'rollup';
import type { PWAPluginContext } from './context';
import type { VitePluginPWAAPI } from './types';
export declare function _generateSW({ options, viteConfig }: PWAPluginContext): Promise<void>;
export declare function _generateBundle({ options, viteConfig, useImportRegister }: PWAPluginContext, bundle?: OutputBundle): OutputBundle;
export declare function createAPI(ctx: PWAPluginContext): VitePluginPWAAPI;
