const { build } = require('esbuild');
const pkg = require('./package.json');

const DEV = process.argv.includes('--dev');

// Node-module
build({
    entryPoints: ['./src/index.js'],
    format: "cjs",
    outfile: pkg.main,
    minify: !DEV,
    sourcemap: DEV && 'inline',
    bundle: true,
});

// ESM
build({
    entryPoints: ['./src/index.js'],
    format: "esm",
    outfile: pkg.module,
    minify: !DEV,
    sourcemap: DEV && 'inline',
    bundle: true,
});

// Browser
build({
    entryPoints: ['./src/index.js'],
    format: "iife",
    globalName: 'Storxy',
    outfile: DEV ? './test/visual/storxy.test.js' : pkg.cdn,
    minify: !DEV,
    sourcemap: DEV && 'inline',
    bundle: true,
});