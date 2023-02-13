export var FILE_SW_REGISTER = 'registerSW.js';
export var VIRTUAL_MODULES_MAP = {
    'virtual:pwa-register': 'register',
    'virtual:pwa-register/vue': 'vue',
    'virtual:pwa-register/svelte': 'svelte',
    'virtual:pwa-register/react': 'react',
    'virtual:pwa-register/preact': 'preact',
    'virtual:pwa-register/solid': 'solid'
};
export var VIRTUAL_MODULES_RESOLVE_PREFIX = '/@vite-sandbox/';
export var VIRTUAL_MODULES = Object.keys(VIRTUAL_MODULES_MAP);
export var defaultInjectManifestVitePlugins = [
    'alias',
    'commonjs',
    'vite:resolve',
    'vite:esbuild',
    'replace',
    'vite:define',
    'rollup-plugin-dynamic-import-variables',
    'vite:esbuild-transpile',
    'vite:json',
    'vite:terser',
];
export var PWA_INFO_VIRTUAL = 'virtual:pwa-info';
export var RESOLVED_PWA_INFO_VIRTUAL = "\0".concat(PWA_INFO_VIRTUAL);
export var DEV_SW_NAME = 'dev-sw.js?dev-sw';
export var DEV_SW_VIRTUAL = "".concat(VIRTUAL_MODULES_RESOLVE_PREFIX, "pwa-entry-point-loaded");
export var RESOLVED_DEV_SW_VIRTUAL = "\0".concat(DEV_SW_VIRTUAL);
export var DEV_READY_NAME = 'vite-pwa-plugin:dev-ready';
export var DEV_REGISTER_SW_NAME = 'vite-sandbox:register-sw';
