import { useState } from 'react';
import { registerSW } from './register';
export function useRegisterSW(options = {}) {
    const { immediate = true, onNeedRefresh, onOfflineReady, onRegistered, onRegisteredSW, onRegisterError, } = options;
    const [needRefresh, setNeedRefresh] = useState(false);
    const [offlineReady, setOfflineReady] = useState(false);
    const [updateServiceWorker] = useState(() => {
        return registerSW({
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
    });
    return {
        needRefresh: [needRefresh, setNeedRefresh],
        offlineReady: [offlineReady, setOfflineReady],
        updateServiceWorker,
    };
}
//# sourceMappingURL=react.js.map