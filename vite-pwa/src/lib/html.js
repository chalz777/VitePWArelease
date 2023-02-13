import { DEV_READY_NAME, DEV_REGISTER_SW_NAME, DEV_SW_NAME, DEV_SW_VIRTUAL, FILE_SW_REGISTER, } from './constants';
export function generateSimpleSWRegister(options, dev) {
    var _a;
    const path = dev ? `${options.base}${DEV_SW_NAME}` : `${options.base}${options.filename}`;
    // we are using HMR to load this script: DO NOT ADD window::load event listener
    if (dev) {
        const swType = (_a = options.devOptions.type) !== null && _a !== void 0 ? _a : 'classic';
        return `if('serviceWorker' in navigator) navigator.serviceWorker.register('${path}', { scope: '${options.scope}', type: '${swType}' })`;
    }
    return `
if('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('${path}', { scope: '${options.scope}' })
})
}`.replace(/\n/g, '');
}
export function injectServiceWorker(html, options, dev) {
    const manifest = generateWebManifest(options, dev);
    if (!dev) {
        const script = generateRegisterSW(options, dev);
        if (script) {
            return html.replace('</head>', `${manifest}${script}</head>`);
        }
    }
    return html.replace('</head>', `${manifest}</head>`);
}
export function generateWebManifest(options, dev) {
    var _a;
    const crossorigin = options.useCredentials ? ' crossorigin="use-credentials"' : '';
    if (dev) {
        const name = (_a = options.devOptions.webManifestUrl) !== null && _a !== void 0 ? _a : `${options.base}${options.manifestFilename}`;
        return options.manifest ? `<link rel="manifest" href="${name}"${crossorigin}>` : '';
    }
    else {
        return options.manifest ? `<link rel="manifest" href="${options.base}${options.manifestFilename}"${crossorigin}>` : '';
    }
}
export function generateRegisterSW(options, dev) {
    if (options.injectRegister === 'inline')
        return `<script id="vite-plugin-pwa:inline-sw">${generateSimpleSWRegister(options, dev)}</script>`;
    else if (options.injectRegister === 'script')
        return `<script id="vite-plugin-pwa:register-sw" src="${options.base}${FILE_SW_REGISTER}"></script>`;
    return undefined;
}
export function generateRegisterDevSW() {
    return `<script id="vite-plugin-pwa:register-dev-sw" type="module">
import registerDevSW from '${DEV_SW_VIRTUAL}';
registerDevSW();
</script>`;
}
export function generateSWHMR() {
    return `
import.meta.hot.on('${DEV_REGISTER_SW_NAME}', ({ inline, inlinePath, registerPath, scope, swType = 'classic' }) => {
  if (inline) {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register(inlinePath, { scope, type: swType });
    }
  }
  else {
    const registerSW = document.createElement('script');
    registerSW.setAttribute('id', 'vite-plugin-pwa:register-sw');
    registerSW.setAttribute('src', registerPath);
    document.head.appendChild(registerSW);
  }
});
function registerDevSW() {
  try {
    import.meta.hot.send('${DEV_READY_NAME}');
  } catch (e) {
    console.error('unable to send ${DEV_READY_NAME} message to register service worker in dev mode!', e);
  }
}
export default registerDevSW;
`;
}
//# sourceMappingURL=html.js.map