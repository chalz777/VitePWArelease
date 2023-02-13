import { ref } from 'vue';
import { registerSW } from './register';
export function useRegisterSW(options = {}) {
    const { immediate = true, onNeedRefresh, onOfflineReady, onRegistered, onRegisteredSW, onRegisterError, } = options;
    const needRefresh = ref(false);
    const offlineReady = ref(false);
    const updateServiceWorker = registerSW({
        immediate,
        onNeedRefresh() {
            needRefresh.value = true;
            onNeedRefresh === null || onNeedRefresh === void 0 ? void 0 : onNeedRefresh();
        },
        onOfflineReady() {
            offlineReady.value = true;
            onOfflineReady === null || onOfflineReady === void 0 ? void 0 : onOfflineReady();
        },
        onRegistered,
        onRegisteredSW,
        onRegisterError,
    });
    return {
        updateServiceWorker,
        offlineReady,
        needRefresh,
    };
}
//# sourceMappingURL=vue.js.map