import type { ResolvedConfig } from 'vite';
import type { ResolvedVitePWAOptions, VitePWAOptions } from './types';
export interface PWAPluginContext {
    viteConfig: ResolvedConfig;
    userOptions: Partial<VitePWAOptions>;
    options: ResolvedVitePWAOptions;
    useImportRegister: boolean;
    devEnvironment: boolean;
}
export declare function createContext(userOptions: Partial<VitePWAOptions>): PWAPluginContext;
