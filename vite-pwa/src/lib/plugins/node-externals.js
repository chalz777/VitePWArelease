import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { externals } = require('rollup-plugin-node-externals');
export function nodeExternals() {
    return Object.assign({ enforce: 'pre', builtinsPrefix: 'add' }, externals());
}
//# sourceMappingURL=node-externals.js.map