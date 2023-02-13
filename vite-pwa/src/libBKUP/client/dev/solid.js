import { createSignal } from 'solid-js';
export function useRegisterSW(_options = {}) {
    const needRefresh = createSignal(false);
    const offlineReady = createSignal(false);
    const updateServiceWorker = (_reloadPage) => { };
    return {
        needRefresh,
        offlineReady,
        updateServiceWorker,
    };
}
//# sourceMappingURL=solid.js.map