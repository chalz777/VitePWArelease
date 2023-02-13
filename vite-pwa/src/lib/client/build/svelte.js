import { writable } from 'svelte/store';
import { registerSW } from './register';
export function useRegisterSW(options = {}) {
    const { immediate = true, onNeedRefresh, onOfflineReady, onRegistered, onRegisteredSW, onRegisterError, } = options;
    const needRefresh = writable(false);
    const offlineReady = writable(false);
    const updateServiceWorker = registerSW({
        immediate,
        onOfflineReady() {
            offlineReady.set(true);
            onOfflineReady === null || onOfflineReady === void 0 ? void 0 : onOfflineReady();
        },
        onNeedRefresh() {
            needRefresh.set(true);
            onNeedRefresh === null || onNeedRefresh === void 0 ? void 0 : onNeedRefresh();
        },
        onRegistered,
        onRegisteredSW,
        onRegisterError,
    });
    return {
        needRefresh,
        offlineReady,
        updateServiceWorker,
    };
}
//# sourceMappingURL=svelte.js.map