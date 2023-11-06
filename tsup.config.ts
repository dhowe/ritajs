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
  esbuildPlugins: [esbuildPluginVersionInjector()],
  outExtension({ format }) { return { js: `.js` } },
}

const esm: Options = {
  format: ['esm'],
  ...opts,
  target: 'es2020',
  splitting: true,
  skipNodeModulesBundle: true, // ?
}

const cjs: Options = {
  format: ['cjs'],
  ...opts,
  target: 'es2020', // ?
  // skipNodeModulesBundle: true, // ?
  platform: "node",
  splitting: true,
  cjsInterop: true,
  outExtension({ format }) { return { js: `.cjs` } },
}

const iife: Options = {
  format: ['iife'],
  ...opts,
  bundle: true,
  target: 'es2020', // ?
  platform: "browser",
  globalName: "RiTa",
  outExtension({ format }) { return { js: `.iife.js` } },
  footer: { js: "window.RiTa = RiTa.default" }
}

const testEsm: Options = {
  format: ['esm'],
  target: 'es2020', // ?
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
