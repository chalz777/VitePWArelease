import { useState } from 'react';
export function useRegisterSW(_options = {}) {
    const needRefresh = useState(false);
    const offlineReady = useState(false);
    const updateServiceWorker = (_reloadPage) => { };
    return {
        needRefresh,
        offlineReady,
        updateServiceWorker,
    };
}
//# sourceMappingURL=react.js.map