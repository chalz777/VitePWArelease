import { ref } from 'vue';
export function useRegisterSW(_options = {}) {
    const needRefresh = ref(false);
    const offlineReady = ref(false);
    const updateServiceWorker = (_reloadPage) => { };
    return {
        updateServiceWorker,
        offlineReady,
        needRefresh,
    };
}
//# sourceMappingURL=vue.js.map