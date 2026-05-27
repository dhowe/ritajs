import type { Options } from 'tsup';
import { defineConfig } from 'tsup';
import { esbuildPluginVersionInjector } from 'esbuild-plugin-version-injector';

const opts: Options = {
  name: "rita",
  entry: { rita: 'src/rita.js' },
  outDir: 'dist',
  watch: false,
  clean: true,
  minify: false,
  sourcemap: true,
  dts: false,
  bundle: true,
  target: 'es2020',
  metafile: false, // toggle for stats: https://esbuild.github.io/analyze/
  esbuildPlugins: [esbuildPluginVersionInjector()],
  outExtension({ format }) { return { js: `.js` } },
}

const esm: Options = {
  format: ['esm'],
  ...opts,
}

const cjs: Options = {
  format: ['cjs'],
  ...opts,
  platform: "node",
  cjsInterop: true,
  splitting: true,
  outExtension({ format }) { return { js: `.cjs` } },
}

/** Esbuild plugin that stubs out Node-only built-ins for the browser IIFE build */
const nodeStubPlugin = {
  name: 'node-builtins-stub',
  setup(build: any) {
    const STUB = /^(fs|os|readline|module)$/;
    build.onResolve({ filter: STUB }, (args: any) => ({
      path: args.path, namespace: 'node-stub',
    }));
    build.onLoad({ filter: /.*/, namespace: 'node-stub' }, () => ({
      // Provide harmless stubs so file-I/O methods fail gracefully at runtime
      contents: `
        export default {};
        export const EOL = '\\n';
        export const createRequire = () => () => ({});
      `,
      loader: 'js',
    }));
  },
};

const iife: Options = {
  format: ['iife'],
  ...opts,
  minify: true,
  platform: "browser",
  globalName: "iife",
  footer: { js: "RiTa = iife.RiTa" },
  outExtension({ format }) { return { js: `.min.js` } },
  esbuildPlugins: [esbuildPluginVersionInjector(), nodeStubPlugin],
}

const testEsm: Options = {
  format: ['esm'],
  platform: "node",
  name: "test",
  entry: ['test/[^i]*.js'],
  outDir: 'test/dist',
  watch: false,
  clean: false,
  minify: false,
  sourcemap: false,
  dts: false,
  bundle: false,
}

export default defineConfig([esm, cjs, iife, testEsm]);
