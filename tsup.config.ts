import type { Options } from 'tsup';

const env = process.env.NODE_ENV;

export const tsup: Options = {
  name: "rita",
  target: 'es2020',
  // noExternal: ['chevrotain'],
  entry: { riscript: 'src/index.js' },
  format: [/*'cjs',*/ 'esm'], // generate cjs and esm files
  splitting: true,
  clean: true, // rm dist/*
  dts: false, // generate dts file for main module
  minify: env === 'prod',
  bundle: env === 'prod',
  sourcemap: env === 'prod', // source map is only available in prod
  skipNodeModulesBundle: true,
  watch: false,//env === 'development',
  outDir: env === 'prod' ? 'dist' : 'lib',
  //format: ['cjs', 'esm'], // generate cjs and esm files
};
