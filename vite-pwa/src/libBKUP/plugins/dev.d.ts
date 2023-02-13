import type { Plugin } from 'vite';
import type { PWAPluginContext } from '../context';
export declare const swDevOptions: {
    swUrl: string;
    swDevGenerated: boolean;
    workboxPaths: Map<string, string>;
};
export declare function DevPlugin(ctx: PWAPluginContext): Plugin;
