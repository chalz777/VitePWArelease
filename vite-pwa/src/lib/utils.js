export function slash(str) {
    return str.replace(/\\/g, '/');
}
export function resolveBathPath(base) {
    if (isAbsolute(base))
        return base;
    return !base.startsWith('/') && !base.startsWith('./')
        ? `/${base}`
        : base;
}
export function isAbsolute(url) {
    return url.match(/^(?:[a-z]+:)?\/\//i);
}
export function normalizePath(path) {
    return path.replace(/\\/g, '/');
}
//# sourceMappingURL=utils.js.map