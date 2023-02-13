import { createSignal } from 'solid-js';
import { registerSW } from './register';
export function useRegisterSW(options = {}) {
    const { immediate = true, onNeedRefresh, onOfflineReady, onRegistered, onRegisteredSW, onRegisterError, } = options;
    const [needRefresh, setNeedRefresh] = createSignal(false);
    const [offlineReady, setOfflineReady] = createSignal(false);
    const updateServiceWorker = registerSW({
        immediate,
        onOfflineReady() {
            setOfflineReady(true);
            onOfflineReady === null || onOfflineReady === void 0 ? void 0 : onOfflineReady();
        },
        onNeedRefresh() {
            setNeedRefresh(true);
            onNeedRefresh === null || onNeedRefresh === void 0 ? void 0 : onNeedRefresh();
        },
        onRegistered,
        onRegisteredSW,
        onRegisterError,
    });
    return {
        needRefresh: [needRefresh, setNeedRefresh],
        offlineReady: [offlineReady, setOfflineReady],
        updateServiceWorker,
    };
}
//# sourceMappingURL=solid.js.map