var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// src/context.ts
function createContext(userOptions) {
  return {
    userOptions,
    options: void 0,
    viteConfig: void 0,
    useImportRegister: false,
    devEnvironment: false
  };
}

// src/constants.ts
var FILE_SW_REGISTER = "registerSW.js";
var VIRTUAL_MODULES_MAP = {
  "virtual:pwa-register": "register",
  "virtual:pwa-register/vue": "vue",
  "virtual:pwa-register/svelte": "svelte",
  "virtual:pwa-register/react": "react",
  "virtual:pwa-register/preact": "preact",
  "virtual:pwa-register/solid": "solid"
};
var VIRTUAL_MODULES_RESOLVE_PREFIX = "/@vite-sandbox/";
var VIRTUAL_MODULES = Object.keys(VIRTUAL_MODULES_MAP);
var defaultInjectManifestVitePlugins = [
  "alias",
  "commonjs",
  "vite:resolve",
  "vite:esbuild",
  "replace",
  "vite:define",
  "rollup-plugin-dynamic-import-variables",
  "vite:esbuild-transpile",
  "vite:json",
  "vite:terser"
];
var PWA_INFO_VIRTUAL = "virtual:pwa-info";
var RESOLVED_PWA_INFO_VIRTUAL = `\0${PWA_INFO_VIRTUAL}`;
var DEV_SW_NAME = "dev-sw.js?dev-sw";
var DEV_SW_VIRTUAL = `${VIRTUAL_MODULES_RESOLVE_PREFIX}pwa-entry-point-loaded`;
var RESOLVED_DEV_SW_VIRTUAL = `\0${DEV_SW_VIRTUAL}`;
var DEV_READY_NAME = "vite-pwa-plugin:dev-ready";
var DEV_REGISTER_SW_NAME = "vite-sandbox:register-sw";

// src/html.ts
function generateSimpleSWRegister(options2, dev) {
  const path = dev ? `${options2.base}${DEV_SW_NAME}` : `${options2.base}${options2.filename}`;
  if (dev) {
    const swType = options2.devOptions.type ?? "classic";
    return `if('serviceWorker' in navigator) navigator.serviceWorker.register('${path}', { scope: '${options2.scope}', type: '${swType}' })`;
  }
  return `
if('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('${path}', { scope: '${options2.scope}' })
})
}`.replace(/\n/g, "");
}
function injectServiceWorker(html, options2, dev) {
  const manifest = generateWebManifest(options2, dev);
  if (!dev) {
    const script = generateRegisterSW(options2, dev);
    if (script) {
      return html.replace(
        "</head>",
        `${manifest}${script}</head>`
      );
    }
  }
  return html.replace(
    "</head>",
    `${manifest}</head>`
  );
}
function generateWebManifest(options2, dev) {
  const crossorigin = options2.useCredentials ? ' crossorigin="use-credentials"' : "";
  if (dev) {
    const name = options2.devOptions.webManifestUrl ?? `${options2.base}${options2.manifestFilename}`;
    return options2.manifest ? `<link rel="manifest" href="${name}"${crossorigin}>` : "";
  } else {
    return options2.manifest ? `<link rel="manifest" href="${options2.base}${options2.manifestFilename}"${crossorigin}>` : "";
  }
}
function generateRegisterSW(options2, dev) {
  if (options2.injectRegister === "inline")
    return `<script id="vite-sandbox:inline-sw">${generateSimpleSWRegister(options2, dev)}<\/script>`;
  else if (options2.injectRegister === "script")
    return `<script id="vite-sandbox:register-sw" src="${options2.base}${FILE_SW_REGISTER}"><\/script>`;
  return void 0;
}
function generateRegisterDevSW() {
  return `<script id="vite-sandbox:register-dev-sw" type="module">
import registerDevSW from '${DEV_SW_VIRTUAL}';
registerDevSW();
<\/script>`;
}
function generateSWHMR() {
  return `
import.meta.hot.on('${DEV_REGISTER_SW_NAME}', ({ inline, inlinePath, registerPath, scope, swType = 'classic' }) => {
  if (inline) {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register(inlinePath, { scope, type: swType });
    }
  }
  else {
    const registerSW = document.createElement('script');
    registerSW.setAttribute('id', 'vite-sandbox:register-sw');
    registerSW.setAttribute('src', registerPath);
    document.head.appendChild(registerSW);
  }
});
function registerDevSW() {
  try {
    import.meta.hot.send('${DEV_READY_NAME}');
  } catch (e) {
    console.error('unable to send ${DEV_READY_NAME} message to register service worker in dev mode!', e);
  }
}
export default registerDevSW;
`;
}

// src/api.ts
import { resolve as resolve2 } from "path";
import { existsSync } from "fs";

// src/modules.ts
import { dirname, resolve } from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

// src/log.ts
import { relative } from "path";

// node_modules/.pnpm/kolorist@1.5.1/node_modules/kolorist/dist/esm/index.mjs
var enabled = true;
var globalVar = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
var supportLevel = 0;
if (globalVar.process && globalVar.process.env && globalVar.process.stdout) {
  const { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = globalVar.process.env;
  if (NODE_DISABLE_COLORS || FORCE_COLOR === "0") {
    enabled = false;
  } else if (FORCE_COLOR === "1") {
    enabled = true;
  } else if (TERM === "dumb") {
    enabled = false;
  } else if ("CI" in globalVar.process.env && [
    "TRAVIS",
    "CIRCLECI",
    "APPVEYOR",
    "GITLAB_CI",
    "GITHUB_ACTIONS",
    "BUILDKITE",
    "DRONE"
  ].some((vendor) => vendor in globalVar.process.env)) {
    enabled = true;
  } else {
    enabled = process.stdout.isTTY;
  }
  if (enabled) {
    supportLevel = TERM && TERM.endsWith("-256color") ? 2 : 1;
  }
}
var options = {
  enabled,
  supportLevel
};
function kolorist(start, end, level = 1) {
  const open = `\x1B[${start}m`;
  const close = `\x1B[${end}m`;
  const regex = new RegExp(`\\x1b\\[${end}m`, "g");
  return (str) => {
    return options.enabled && options.supportLevel >= level ? open + ("" + str).replace(regex, open) + close : "" + str;
  };
}
var reset = kolorist(0, 0);
var bold = kolorist(1, 22);
var dim = kolorist(2, 22);
var italic = kolorist(3, 23);
var underline = kolorist(4, 24);
var inverse = kolorist(7, 27);
var hidden = kolorist(8, 28);
var strikethrough = kolorist(9, 29);
var black = kolorist(30, 39);
var red = kolorist(31, 39);
var green = kolorist(32, 39);
var yellow = kolorist(33, 39);
var blue = kolorist(34, 39);
var magenta = kolorist(35, 39);
var cyan = kolorist(36, 39);
var white = kolorist(97, 39);
var gray = kolorist(90, 39);
var lightGray = kolorist(37, 39);
var lightRed = kolorist(91, 39);
var lightGreen = kolorist(92, 39);
var lightYellow = kolorist(93, 39);
var lightBlue = kolorist(94, 39);
var lightMagenta = kolorist(95, 39);
var lightCyan = kolorist(96, 39);
var bgBlack = kolorist(40, 49);
var bgRed = kolorist(41, 49);
var bgGreen = kolorist(42, 49);
var bgYellow = kolorist(43, 49);
var bgBlue = kolorist(44, 49);
var bgMagenta = kolorist(45, 49);
var bgCyan = kolorist(46, 49);
var bgWhite = kolorist(107, 49);
var bgGray = kolorist(100, 49);
var bgLightRed = kolorist(101, 49);
var bgLightGreen = kolorist(102, 49);
var bgLightYellow = kolorist(103, 49);
var bgLightBlue = kolorist(104, 49);
var bgLightMagenta = kolorist(105, 49);
var bgLightCyan = kolorist(106, 49);
var bgLightGray = kolorist(47, 49);

// package.json
var version = "0.13.3";

// src/log.ts
function logWorkboxResult(strategy, buildResult, viteOptions) {
  const { root, logLevel = "info" } = viteOptions;
  if (logLevel === "silent")
    return;
  const { count, size, filePaths, warnings } = buildResult;
  if (logLevel === "info") {
    console.info([
      "",
      `${cyan(`PWA v${version}`)}`,
      `mode      ${magenta(strategy)}`,
      `precache  ${green(`${count} entries`)} ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}`,
      "files generated",
      ...filePaths.map((p) => `  ${dim(relative(root, p))}`)
    ].join("\n"));
  }
  warnings && warnings.length > 0 && console.warn(yellow([
    "warnings",
    ...warnings.map((w) => `  ${w}`),
    ""
  ].join("\n")));
}

// src/modules.ts
var _dirname = typeof __dirname !== "undefined" ? __dirname : dirname(fileURLToPath(import.meta.url));
async function loadWorkboxBuild() {
  try {
    const workbox = await import("workbox-build");
    return workbox.default ?? workbox;
  } catch (_) {
    return __require("workbox-build");
  }
}
async function loadRollupReplacePlugin() {
  try {
    const { createRequire } = await import("module").then((m) => m.default || m);
    const nodeRequire = createRequire(_dirname);
    return nodeRequire("@rollup/plugin-replace");
  } catch (_) {
    return __require("@rollup/plugin-replace");
  }
}
async function generateRegisterSW2(options2, mode, source = "register") {
  const sw = options2.base + options2.filename;
  const scope = options2.scope;
  const content = await fs.readFile(resolve(_dirname, `client/${mode}/${source}.mjs`), "utf-8");
  return content.replace(/__SW__/g, sw).replace("__SCOPE__", scope).replace("__SW_AUTO_UPDATE__", `${options2.registerType === "autoUpdate"}`).replace("__SW_SELF_DESTROYING__", `${options2.selfDestroying}`).replace("__TYPE__", `${options2.devOptions.enabled ? options2.devOptions.type : "classic"}`);
}
async function generateServiceWorker(options2, viteOptions) {
  if (options2.selfDestroying) {
    const selfDestroyingSW = `
self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  self.registration.unregister()
    .then(function() {
      return self.clients.matchAll();
    })
    .then(function(clients) {
      clients.forEach(client => client.navigate(client.url))
    });
});
    `;
    await fs.writeFile(options2.swDest.replace(/\\/g, "/"), selfDestroyingSW, { encoding: "utf8" });
    return {
      count: 1,
      size: selfDestroyingSW.length,
      warnings: [],
      filePaths: [options2.filename]
    };
  }
  const { generateSW } = await loadWorkboxBuild();
  const buildResult = await generateSW(options2.workbox);
  logWorkboxResult("generateSW", buildResult, viteOptions);
  return buildResult;
}
async function generateInjectManifest(options2, viteOptions) {
  const { selfDestroying } = options2;
  if (selfDestroying) {
    await generateServiceWorker(options2, viteOptions);
    return;
  }
  const vitePlugins = options2.vitePlugins;
  const includedPluginNames = [];
  if (typeof vitePlugins === "function")
    includedPluginNames.push(...vitePlugins(viteOptions.plugins.map((p) => p.name)));
  else
    includedPluginNames.push(...vitePlugins);
  if (includedPluginNames.length === 0)
    includedPluginNames.push(...defaultInjectManifestVitePlugins);
  const replace = await loadRollupReplacePlugin();
  const plugins = [
    replace({
      "preventAssignment": true,
      "process.env.NODE_ENV": JSON.stringify(options2.mode)
    }),
    ...viteOptions.plugins.filter((p) => includedPluginNames.includes(p.name))
  ];
  const { rollup } = await import("rollup");
  const bundle = await rollup({
    input: options2.swSrc,
    plugins
  });
  try {
    await bundle.write({
      format: options2.rollupFormat,
      exports: "none",
      inlineDynamicImports: true,
      file: options2.injectManifest.swDest,
      sourcemap: viteOptions.build.sourcemap
    });
  } finally {
    await bundle.close();
  }
  const injectManifestOptions = {
    ...options2.injectManifest,
    swSrc: options2.injectManifest.swDest
  };
  const { injectManifest } = await loadWorkboxBuild();
  const buildResult = await injectManifest(injectManifestOptions);
  logWorkboxResult("injectManifest", buildResult, viteOptions);
}

// src/assets.ts
import { resolve as resolveFs } from "path";
import fs2 from "fs";
import crypto from "crypto";
import fg from "fast-glob";
function buildManifestEntry(publicDir, url) {
  return new Promise((resolve5, reject) => {
    const cHash = crypto.createHash("MD5");
    const stream = fs2.createReadStream(resolveFs(publicDir, url));
    stream.on("error", (err) => {
      reject(err);
    });
    stream.on("data", (chunk) => {
      cHash.update(chunk);
    });
    stream.on("end", () => {
      return resolve5({
        url,
        revision: `${cHash.digest("hex")}`
      });
    });
  });
}
function lookupAdditionalManifestEntries(useInjectManifest, injectManifest, workbox) {
  return useInjectManifest ? injectManifest.additionalManifestEntries || [] : workbox.additionalManifestEntries || [];
}
function normalizeIconPath(path) {
  return path.startsWith("/") ? path.substring(1) : path;
}
function includeIcons(icons, globs) {
  Object.keys(icons).forEach((key) => {
    const icon = icons[key];
    const src = normalizeIconPath(icon.src);
    if (!globs.includes(src))
      globs.push(src);
  });
}
async function configureStaticAssets(resolvedVitePWAOptions, viteConfig) {
  const {
    manifest,
    strategies,
    injectManifest,
    workbox,
    includeAssets,
    includeManifestIcons,
    manifestFilename
  } = resolvedVitePWAOptions;
  const useInjectManifest = strategies === "injectManifest";
  const { publicDir } = viteConfig;
  const globs = [];
  const manifestEntries = lookupAdditionalManifestEntries(
    useInjectManifest,
    injectManifest,
    workbox
  );
  if (includeAssets) {
    if (Array.isArray(includeAssets))
      globs.push(...includeAssets.map(normalizeIconPath));
    else
      globs.push(normalizeIconPath(includeAssets));
  }
  if (includeManifestIcons && manifest) {
    manifest.icons && includeIcons(manifest.icons, globs);
    manifest.shortcuts && manifest.shortcuts.forEach((s) => {
      s.icons && includeIcons(s.icons, globs);
    });
  }
  if (globs.length > 0) {
    let assets = await fg(
      globs,
      {
        cwd: publicDir,
        onlyFiles: true,
        unique: true
      }
    );
    if (manifestEntries.length > 0) {
      const included = manifestEntries.map((me) => {
        if (typeof me === "string")
          return me;
        else
          return me.url;
      });
      assets = assets.filter((a) => !included.includes(a));
    }
    const assetsEntries = await Promise.all(assets.map((a) => {
      return buildManifestEntry(publicDir, a);
    }));
    manifestEntries.push(...assetsEntries);
  }
  if (manifest) {
    const cHash = crypto.createHash("MD5");
    cHash.update(generateWebManifestFile(resolvedVitePWAOptions));
    manifestEntries.push({
      url: manifestFilename,
      revision: `${cHash.digest("hex")}`
    });
  }
  if (manifestEntries.length > 0) {
    if (useInjectManifest)
      injectManifest.additionalManifestEntries = manifestEntries;
    else
      workbox.additionalManifestEntries = manifestEntries;
  }
}
function generateWebManifestFile(options2) {
  return `${JSON.stringify(options2.manifest, null, options2.minify ? 0 : 2)}
`;
}

// src/api.ts
async function _generateSW({ options: options2, viteConfig }) {
  if (options2.disable)
    return;
  if (options2.strategies === "injectManifest")
    await generateInjectManifest(options2, viteConfig);
  else
    await generateServiceWorker(options2, viteConfig);
}
function _generateBundle({ options: options2, viteConfig, useImportRegister }, bundle) {
  if (options2.disable || !bundle)
    return;
  if (options2.manifest) {
    bundle[options2.manifestFilename] = {
      isAsset: true,
      type: "asset",
      name: void 0,
      source: generateWebManifestFile(options2),
      fileName: options2.manifestFilename
    };
  }
  if (options2.injectRegister === "auto")
    options2.injectRegister = useImportRegister ? null : "script";
  if (options2.injectRegister === "script" && !existsSync(resolve2(viteConfig.publicDir, FILE_SW_REGISTER))) {
    bundle[FILE_SW_REGISTER] = {
      isAsset: true,
      type: "asset",
      name: void 0,
      source: generateSimpleSWRegister(options2, false),
      fileName: FILE_SW_REGISTER
    };
  }
  return bundle;
}
function createAPI(ctx) {
  return {
    get disabled() {
      var _a;
      return (_a = ctx == null ? void 0 : ctx.options) == null ? void 0 : _a.disable;
    },
    get pwaInDevEnvironment() {
      return (ctx == null ? void 0 : ctx.devEnvironment) === true;
    },
    webManifestData() {
      const options2 = ctx == null ? void 0 : ctx.options;
      if (!options2 || options2.disable || !options2.manifest || ctx.devEnvironment && !ctx.options.devOptions.enabled)
        return void 0;
      let url = options2.manifestFilename;
      let manifest;
      if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
        url = ctx.options.devOptions.webManifestUrl ?? options2.manifestFilename;
        manifest = generateWebManifest(options2, true);
      } else {
        manifest = generateWebManifest(options2, false);
      }
      return {
        href: `${options2.base}${url}`,
        useCredentials: ctx.options.useCredentials,
        toLinkTag() {
          return manifest;
        }
      };
    },
    registerSWData() {
      const options2 = ctx == null ? void 0 : ctx.options;
      if (!options2 || options2.disable || ctx.devEnvironment && !ctx.options.devOptions.enabled)
        return void 0;
      const mode = options2.injectRegister;
      if (!mode || ctx.useImportRegister)
        return void 0;
      let type = "classic";
      let script;
      let shouldRegisterSW = options2.injectRegister === "inline" || options2.injectRegister === "script";
      if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
        type = ctx.options.devOptions.type ?? "classic";
        script = generateRegisterDevSW();
        shouldRegisterSW = true;
      } else if (shouldRegisterSW) {
        script = generateRegisterSW(options2, false);
      }
      return {
        shouldRegisterSW,
        inline: options2.injectRegister === "inline",
        scope: options2.scope,
        inlinePath: `${options2.base}${ctx.devEnvironment ? DEV_SW_NAME : options2.filename}`,
        registerPath: `${options2.base}${FILE_SW_REGISTER}`,
        type,
        toScriptTag() {
          return script;
        }
      };
    },
    generateBundle(bundle) {
      return _generateBundle(ctx, bundle);
    },
    async generateSW() {
      return await _generateSW(ctx);
    },
    extendManifestEntries(fn) {
      const { options: options2 } = ctx;
      if (options2.disable)
        return;
      const configField = options2.strategies === "generateSW" ? "workbox" : "injectManifest";
      const result = fn(options2[configField].additionalManifestEntries || []);
      if (result != null)
        options2[configField].additionalManifestEntries = result;
    }
  };
}

// src/plugins/build.ts
function BuildPlugin(ctx) {
  var _a, _b;
  return {
    name: "vite-sandbox:build",
    enforce: "post",
    apply: "build",
    transformIndexHtml: {
      enforce: "post",
      transform(html) {
        const { options: options2, useImportRegister } = ctx;
        if (options2.disable)
          return html;
        if (options2.injectRegister === "auto")
          options2.injectRegister = useImportRegister ? null : "script";
        return injectServiceWorker(html, options2, false);
      }
    },
    generateBundle(_, bundle) {
      return _generateBundle(ctx, bundle);
    },
    closeBundle: {
      sequential: true,
      order: (_b = (_a = ctx.userOptions) == null ? void 0 : _a.integration) == null ? void 0 : _b.closeBundleOrder,
      async handler() {
        if (!ctx.viteConfig.build.ssr && !ctx.options.disable)
          await _generateSW(ctx);
      }
    },
    async buildEnd(error) {
      if (error)
        throw error;
    }
  };
}

// src/plugins/dev.ts
import { basename, resolve as resolve3 } from "path";
import { existsSync as existsSync2, promises as fs3, mkdirSync } from "fs";

// src/utils.ts
function resolveBathPath(base) {
  if (isAbsolute(base))
    return base;
  return !base.startsWith("/") && !base.startsWith("./") ? `/${base}` : base;
}
function isAbsolute(url) {
  return url.match(/^(?:[a-z]+:)?\/\//i);
}
function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

// src/plugins/dev.ts
var swDevOptions = {
  swUrl: DEV_SW_NAME,
  swDevGenerated: false,
  workboxPaths: /* @__PURE__ */ new Map()
};
function DevPlugin(ctx) {
  return {
    name: "vite-sandbox:dev-sw",
    apply: "serve",
    transformIndexHtml: {
      enforce: "post",
      async transform(html) {
        const { options: options2 } = ctx;
        if (options2.disable || !options2.manifest || !options2.devOptions.enabled)
          return html;
        html = injectServiceWorker(html, options2, true);
        return html.replace(
          "</body>",
          `${generateRegisterDevSW()}
</body>`
        );
      }
    },
    configureServer(server) {
      ctx.devEnvironment = true;
      const { options: options2 } = ctx;
      if (!options2.disable && options2.manifest && options2.devOptions.enabled) {
        server.ws.on(DEV_READY_NAME, createSWResponseHandler(server, ctx));
        const name = options2.devOptions.webManifestUrl ?? `${options2.base}${options2.manifestFilename}`;
        server.middlewares.use((req, res, next) => {
          if (req.url === name) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/manifest+json");
            res.write(generateWebManifestFile(options2), "utf-8");
            res.end();
          } else {
            next();
          }
        });
      }
    },
    resolveId(id) {
      if (id === DEV_SW_VIRTUAL)
        return RESOLVED_DEV_SW_VIRTUAL;
      const { options: options2 } = ctx;
      if (!options2.disable && options2.devOptions.enabled && options2.strategies === "injectManifest" && !options2.selfDestroying) {
        const name = id.startsWith("/") ? id.slice(1) : id;
        return name === swDevOptions.swUrl || name === options2.injectManifest.swSrc ? options2.injectManifest.swSrc : void 0;
      }
      return void 0;
    },
    async load(id) {
      if (id === RESOLVED_DEV_SW_VIRTUAL)
        return generateSWHMR();
      const { options: options2, viteConfig } = ctx;
      if (!options2.disable && options2.devOptions.enabled) {
        if (options2.strategies === "injectManifest" && !options2.selfDestroying) {
          const swSrc = normalizePath(options2.injectManifest.swSrc);
          if (id === swSrc) {
            let content = await fs3.readFile(options2.injectManifest.swSrc, "utf-8");
            const resolvedIP = options2.injectManifest.injectionPoint;
            if (resolvedIP) {
              const ip = new RegExp(resolvedIP, "g");
              const navigateFallback = options2.devOptions.navigateFallback;
              if (navigateFallback)
                content = content.replace(ip, `[{ url: '${navigateFallback}' }]`);
              else
                content = content.replace(ip, "[]");
            }
            return content;
          }
          if (swDevOptions.workboxPaths.has(id))
            return await fs3.readFile(swDevOptions.workboxPaths.get(id), "utf-8");
          return void 0;
        }
        if (id.endsWith(swDevOptions.swUrl)) {
          const globDirectory = resolve3(viteConfig.root, "dev-dist");
          if (!existsSync2(globDirectory))
            mkdirSync(globDirectory);
          const swDest = resolve3(globDirectory, "sw.js");
          if (!swDevOptions.swDevGenerated || !existsSync2(swDest)) {
            const navigateFallback = options2.workbox.navigateFallback;
            const { filePaths } = await generateServiceWorker(
              Object.assign(
                {},
                options2,
                {
                  swDest: options2.selfDestroying ? swDest : options2.swDest,
                  workbox: {
                    ...options2.workbox,
                    navigateFallbackAllowlist: options2.devOptions.navigateFallbackAllowlist ?? [/^\/$/],
                    runtimeCaching: options2.devOptions.disableRuntimeConfig ? void 0 : options2.workbox.runtimeCaching,
                    additionalManifestEntries: navigateFallback ? [navigateFallback] : void 0,
                    cleanupOutdatedCaches: true,
                    globDirectory: globDirectory.replace(/\\/g, "/"),
                    swDest: swDest.replace(/\\/g, "/")
                  }
                }
              ),
              viteConfig
            );
            filePaths.forEach((we) => {
              const name = basename(we);
              if (name !== "sw.js")
                swDevOptions.workboxPaths.set(normalizePath(`${options2.base}${name}`), we);
            });
            swDevOptions.swDevGenerated = true;
          }
          return await fs3.readFile(swDest, "utf-8");
        }
        const key = normalizePath(`${options2.base}${id.startsWith("/") ? id.slice(1) : id}`);
        if (swDevOptions.workboxPaths.has(key))
          return await fs3.readFile(swDevOptions.workboxPaths.get(key), "utf-8");
      }
    }
  };
}
async function createDevRegisterSW(options2, viteConfig) {
  if (options2.injectRegister === "script") {
    const devDist = resolve3(viteConfig.root, "dev-dist");
    if (!existsSync2(devDist))
      mkdirSync(devDist);
    const registerSW = resolve3(devDist, FILE_SW_REGISTER);
    if (existsSync2(registerSW)) {
      if (!swDevOptions.workboxPaths.has(registerSW))
        swDevOptions.workboxPaths.set(normalizePath(`${options2.base}${FILE_SW_REGISTER}`), registerSW);
      return;
    }
    await fs3.writeFile(registerSW, generateSimpleSWRegister(options2, true), { encoding: "utf8" });
    swDevOptions.workboxPaths.set(normalizePath(`${options2.base}${FILE_SW_REGISTER}`), registerSW);
  }
}
function createSWResponseHandler(server, ctx) {
  return async () => {
    const { options: options2, useImportRegister } = ctx;
    const { injectRegister, scope, base } = options2;
    if (!useImportRegister && injectRegister) {
      if (injectRegister === "auto")
        options2.injectRegister = "script";
      await createDevRegisterSW(options2, ctx.viteConfig);
      server.ws.send({
        type: "custom",
        event: DEV_REGISTER_SW_NAME,
        data: {
          inline: options2.injectRegister === "inline",
          scope,
          inlinePath: `${base}${DEV_SW_NAME}`,
          registerPath: `${base}${FILE_SW_REGISTER}`,
          swType: options2.devOptions.type
        }
      });
    }
  };
}

// src/options.ts
import fs4 from "fs";
import { extname, resolve as resolve4 } from "path";
function resolveSwPaths(injectManifest, root, srcDir, outDir, filename) {
  const swSrc = resolve4(root, srcDir, filename);
  if (injectManifest && extname(filename) === ".ts" && fs4.existsSync(swSrc)) {
    const useFilename = `${filename.substring(0, filename.lastIndexOf("."))}.js`;
    return {
      swSrc,
      swDest: resolve4(root, outDir, useFilename),
      useFilename
    };
  }
  return {
    swSrc,
    swDest: resolve4(root, outDir, filename)
  };
}
async function resolveOptions(options2, viteConfig) {
  var _a;
  const root = viteConfig.root;
  const pkg = fs4.existsSync("package.json") ? JSON.parse(fs4.readFileSync("package.json", "utf-8")) : {};
  const {
    mode = process["env"]["NODE_ENV"] || "production",
    srcDir = "public",
    outDir = viteConfig.build.outDir || "dist",
    injectRegister = "auto",
    registerType = "prompt",
    filename = "sw.js",
    manifestFilename = "manifest.webmanifest",
    strategies = "generateSW",
    minify = true,
    base = viteConfig.base,
    includeAssets = void 0,
    includeManifestIcons = true,
    useCredentials = false,
    disable = false,
    devOptions = { enabled: false, type: "classic" },
    selfDestroying = false,
    integration = {}
  } = options2;
  const basePath = resolveBathPath(base);
  const { swSrc, swDest, useFilename } = resolveSwPaths(
    strategies === "injectManifest",
    root,
    srcDir,
    outDir,
    filename
  );
  const outDirRoot = resolve4(root, outDir);
  const scope = options2.scope || basePath;
  const defaultWorkbox = {
    swDest,
    globDirectory: outDirRoot,
    offlineGoogleAnalytics: false,
    cleanupOutdatedCaches: true,
    dontCacheBustURLsMatching: /\.[a-f0-9]{8}\./,
    mode,
    navigateFallback: "index.html"
  };
  const defaultInjectManifest = {
    swSrc,
    swDest,
    globDirectory: outDirRoot,
    dontCacheBustURLsMatching: /\.[a-f0-9]{8}\./,
    injectionPoint: "self.__WB_MANIFEST"
  };
  const defaultManifest = {
    name: pkg.name,
    short_name: pkg.name,
    start_url: basePath,
    display: "standalone",
    background_color: "#ffffff",
    lang: "en",
    scope
  };
  const workbox = Object.assign({}, defaultWorkbox, options2.workbox || {});
  const manifest = typeof options2.manifest === "boolean" && !options2.manifest ? false : Object.assign({}, defaultManifest, options2.manifest || {});
  const {
    vitePlugins = defaultInjectManifestVitePlugins,
    rollupFormat = "es",
    ...userInjectManifest
  } = options2.injectManifest || {};
  const injectManifest = Object.assign({}, defaultInjectManifest, userInjectManifest);
  if ((injectRegister === "auto" || injectRegister == null) && registerType === "autoUpdate") {
    workbox.skipWaiting = true;
    workbox.clientsClaim = true;
  }
  if (strategies === "generateSW" && workbox.sourcemap === void 0) {
    const sourcemap = (_a = viteConfig.build) == null ? void 0 : _a.sourcemap;
    workbox.sourcemap = sourcemap === true || sourcemap === "inline" || sourcemap === "hidden";
  }
  if (devOptions.enabled && viteConfig.command === "serve") {
    if (strategies === "generateSW")
      devOptions.type = "classic";
  } else {
    devOptions.enabled = false;
    devOptions.type = "classic";
  }
  const resolvedVitePWAOptions = {
    base: basePath,
    mode,
    swSrc,
    swDest,
    srcDir,
    outDir,
    injectRegister,
    registerType,
    filename: useFilename || filename,
    manifestFilename,
    strategies,
    workbox,
    manifest,
    useCredentials,
    injectManifest,
    scope,
    minify,
    includeAssets,
    includeManifestIcons,
    disable,
    integration,
    devOptions,
    rollupFormat,
    vitePlugins,
    selfDestroying
  };
  await configureStaticAssets(resolvedVitePWAOptions, viteConfig);
  return resolvedVitePWAOptions;
}

// src/plugins/main.ts
function MainPlugin(ctx, api) {
  return {
    name: "vite-sandbox",
    enforce: "pre",
    config() {
      return {
        ssr: {
          noExternal: ["workbox-window"]
        }
      };
    },
    async configResolved(config) {
      var _a, _b, _c;
      ctx.useImportRegister = false;
      ctx.viteConfig = config;
      (_c = (_b = (_a = ctx.userOptions) == null ? void 0 : _a.integration) == null ? void 0 : _b.configureOptions) == null ? void 0 : _c.call(_b, config, ctx.userOptions);
      ctx.options = await resolveOptions(ctx.userOptions, config);
    },
    resolveId(id) {
      return VIRTUAL_MODULES.includes(id) ? VIRTUAL_MODULES_RESOLVE_PREFIX + id : void 0;
    },
    load(id) {
      if (id.startsWith(VIRTUAL_MODULES_RESOLVE_PREFIX))
        id = id.slice(VIRTUAL_MODULES_RESOLVE_PREFIX.length);
      else
        return;
      if (VIRTUAL_MODULES.includes(id)) {
        ctx.useImportRegister = true;
        if (ctx.viteConfig.command === "serve" && ctx.options.devOptions.enabled) {
          return generateRegisterSW2(
            { ...ctx.options, filename: swDevOptions.swUrl },
            "build",
            VIRTUAL_MODULES_MAP[id]
          );
        } else {
          return generateRegisterSW2(
            ctx.options,
            !ctx.options.disable && ctx.viteConfig.command === "build" ? "build" : "dev",
            VIRTUAL_MODULES_MAP[id]
          );
        }
      }
    },
    api
  };
}

// src/plugins/info.ts
function InfoPlugin(ctx, api) {
  return {
    name: "vite-sandbox:info",
    enforce: "post",
    resolveId(id) {
      if (id === PWA_INFO_VIRTUAL)
        return RESOLVED_PWA_INFO_VIRTUAL;
      return void 0;
    },
    load(id) {
      if (id === RESOLVED_PWA_INFO_VIRTUAL)
        return generatePwaInfo(ctx, api);
    }
  };
}
function generatePwaInfo(ctx, api) {
  const webManifestData = api.webManifestData();
  if (!webManifestData)
    return "export const pwaInfo = undefined;";
  const { href, useCredentials, toLinkTag } = webManifestData;
  const registerSWData = api.registerSWData();
  const entry = {
    pwaInDevEnvironment: api.pwaInDevEnvironment,
    webManifest: {
      href,
      useCredentials,
      linkTag: toLinkTag()
    }
  };
  if (registerSWData) {
    const scriptTag = registerSWData.toScriptTag();
    if (scriptTag) {
      const { inline, inlinePath, registerPath, type, scope } = registerSWData;
      entry.registerSW = {
        inline,
        inlinePath,
        registerPath,
        type,
        scope,
        scriptTag
      };
    }
  }
  return `export const pwaInfo = ${JSON.stringify(entry)};`;
}

// src/cache.ts
var cachePreset = [
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "google-fonts",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60
      }
    }
  },
  {
    urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-font-assets",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 7 * 24 * 60 * 60
      }
    }
  },
  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-image-assets",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60
      }
    }
  },
  {
    urlPattern: /\.(?:js)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-js-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60
      }
    }
  },
  {
    urlPattern: /\.(?:css|less)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-style-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60
      }
    }
  },
  {
    urlPattern: /\.(?:json|xml|csv)$/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "static-data-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60
      }
    }
  },
  {
    urlPattern: /\/api\/.*$/i,
    handler: "NetworkFirst",
    method: "GET",
    options: {
      cacheName: "apis",
      expiration: {
        maxEntries: 16,
        maxAgeSeconds: 24 * 60 * 60
      },
      networkTimeoutSeconds: 10
    }
  },
  {
    urlPattern: /.*/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "others",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60
      },
      networkTimeoutSeconds: 10
    }
  }
];

// src/index.ts
function VitePWA(userOptions = {}) {
  const ctx = createContext(userOptions);
  const api = createAPI(ctx);
  return [
    MainPlugin(ctx, api),
    InfoPlugin(ctx, api),
    BuildPlugin(ctx),
    DevPlugin(ctx)
  ];
}
export {
  VitePWA,
  cachePreset,
  defaultInjectManifestVitePlugins
};
