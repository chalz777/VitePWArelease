var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/* eslint-disable no-console */
import { relative } from 'path';
import { cyan, dim, green, magenta, yellow } from 'kolorist';
import { version } from '../../package.json';
export function logWorkboxResult(strategy, buildResult, viteOptions) {
    var root = viteOptions.root, _a = viteOptions.logLevel, logLevel = _a === void 0 ? 'info' : _a;
    if (logLevel === 'silent')
        return;
    var count = buildResult.count, size = buildResult.size, filePaths = buildResult.filePaths, warnings = buildResult.warnings;
    if (logLevel === 'info') {
        console.info(__spreadArray([
            '',
            "".concat(cyan("PWA v".concat(version))),
            "mode      ".concat(magenta(strategy)),
            "precache  ".concat(green("".concat(count, " entries")), " ").concat(dim("(".concat((size / 1024).toFixed(2), " KiB)"))),
            'files generated'
        ], filePaths.map(function (p) { return "  ".concat(dim(relative(root, p))); }), true).join('\n'));
    }
    // log build warning
    warnings && warnings.length > 0 && console.warn(yellow(__spreadArray(__spreadArray([
        'warnings'
    ], warnings.map(function (w) { return "  ".concat(w); }), true), [
        '',
    ], false).join('\n')));
}
