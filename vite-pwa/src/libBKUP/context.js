export function createContext(userOptions) {
    return {
        userOptions: userOptions,
        options: undefined,
        viteConfig: undefined,
        useImportRegister: false,
        devEnvironment: false
    };
}
