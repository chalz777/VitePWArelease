import { Plugin } from 'vite'
import { createRequire } from 'module'

const require = createRequire(import.meta.url);
const {externals} = require('rollup-plugin-node-externals');

import resolve from '@rollup/plugin-node-resolve'

export function nodeExternals(): Plugin {
    return {
        enforce: 'pre',
        builtinsPrefix:'add',
        ...externals(),
        //...resolve(),
    };

}