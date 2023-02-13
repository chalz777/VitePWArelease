import { writable } from 'svelte/store';
export function useRegisterSW(_options = {}) {
    const needRefresh = writable(false);
    const offlineReady = writable(false);
    const updateServiceWorker = (_reloadPage) => { };
    return {
        needRefresh,
        offlineReady,
        updateServiceWorker,
    };
}
//# sourceMappingURL=svelte.js.map