import { DEV_READY_NAME, DEV_REGISTER_SW_NAME, DEV_SW_NAME, DEV_SW_VIRTUAL, FILE_SW_REGISTER, } from './constants';
export function generateSimpleSWRegister(options, dev) {
    var _a;
    var path = dev ? "".concat(options.base).concat(DEV_SW_NAME) : "".concat(options.base).concat(options.filename);
    // we are using HMR to load this script: DO NOT ADD window::load event listener
    if (dev) {
        var swType = (_a = options.devOptions.type) !== null && _a !== void 0 ? _a : 'classic';
        return "if('serviceWorker' in navigator) navigator.serviceWorker.register('".concat(path, "', { scope: '").concat(options.scope, "', type: '").concat(swType, "' })");
    }
    return "\nif('serviceWorker' in navigator) {\nwindow.addEventListener('load', () => {\nnavigator.serviceWorker.register('".concat(path, "', { scope: '").concat(options.scope, "' })\n})\n}").replace(/\n/g, '');
}
export function injectServiceWorker(html, options, dev) {
    var manifest = generateWebManifest(options, dev);
    if (!dev) {
        var script = generateRegisterSW(options, dev);
        if (script) {
            return html.replace('</head>', "".concat(manifest).concat(script, "</head>"));
        }
    }
    return html.replace('</head>', "".concat(manifest, "</head>"));
}
export function generateWebManifest(options, dev) {
    var _a;
    var crossorigin = options.useCredentials ? ' crossorigin="use-credentials"' : '';
    if (dev) {
        var name_1 = (_a = options.devOptions.webManifestUrl) !== null && _a !== void 0 ? _a : "".concat(options.base).concat(options.manifestFilename);
        return options.manifest ? "<link rel=\"manifest\" href=\"".concat(name_1, "\"").concat(crossorigin, ">") : '';
    }
    else {
        return options.manifest ? "<link rel=\"manifest\" href=\"".concat(options.base).concat(options.manifestFilename, "\"").concat(crossorigin, ">") : '';
    }
}
export function generateRegisterSW(options, dev) {
    if (options.injectRegister === 'inline')
        return "<script id=\"vite-sandbox:inline-sw\">".concat(generateSimpleSWRegister(options, dev), "</script>");
    else if (options.injectRegister === 'script')
        return "<script id=\"vite-sandbox:register-sw\" src=\"".concat(options.base).concat(FILE_SW_REGISTER, "\"></script>");
    return undefined;
}
export function generateRegisterDevSW() {
    return "<script id=\"vite-sandbox:register-dev-sw\" type=\"module\">\nimport registerDevSW from '".concat(DEV_SW_VIRTUAL, "';\nregisterDevSW();\n</script>");
}
export function generateSWHMR() {
    return "\nimport.meta.hot.on('".concat(DEV_REGISTER_SW_NAME, "', ({ inline, inlinePath, registerPath, scope, swType = 'classic' }) => {\n  if (inline) {\n    if('serviceWorker' in navigator) {\n      navigator.serviceWorker.register(inlinePath, { scope, type: swType });\n    }\n  }\n  else {\n    const registerSW = document.createElement('script');\n    registerSW.setAttribute('id', 'vite-sandbox:register-sw');\n    registerSW.setAttribute('src', registerPath);\n    document.head.appendChild(registerSW);\n  }\n});\nfunction registerDevSW() {\n  try {\n    import.meta.hot.send('").concat(DEV_READY_NAME, "');\n  } catch (e) {\n    console.error('unable to send ").concat(DEV_READY_NAME, " message to register service worker in dev mode!', e);\n  }\n}\nexport default registerDevSW;\n");
}
