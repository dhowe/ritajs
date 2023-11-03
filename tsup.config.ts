
import type { Options } from 'tsup';
import { defineConfig } from 'tsup';


// const env = process.env.NODE_ENV;

const opts: Options = {
  name: "rita",
  entry: { rita: 'src/rita.js' },
  outDir: 'dist',
  watch: false,
  clean: true,
  minify: false, // tmp
  sourcemap: true,
  dts: false,
  bundle: true,
  splitting: true,
  target: 'es2020',
}

const esmOpts: Options = {
  format: ['esm'],
  ...opts,
}

const cjsOpts: Options = {
  format: ['cjs'],
  platform: "node",
  ...opts
}

export default defineConfig([esmOpts, cjsOpts]);


// import type { Options } from 'tsup';

// const env = process.env.NODE_ENV;

// export const tsup: Options = {
//   name: "rita",
//   target: 'es2020',
//   // noExternal: ['chevrotain'],
//   entry: ['lib/rita.js' ],
//   format: [/*'cjs',*/ 'esm'], // generate cjs and esm files
//   splitting: true,
//   clean: true, // rm dist/*
//   dts: false, // generate dts file for main module
//   minify: env === 'prod',
//   bundle: env === 'prod',
//   sourcemap: env === 'prod', // source map is only available in prod
//   skipNodeModulesBundle: true,
//   watch: false,//env === 'development',
//   outDir:  'dist',
//   //format: ['cjs', 'esm'], // generate cjs and esm files
// };
