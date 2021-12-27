const { build } = require('esbuild');
const pkg = require('./package.json');

const DEV = process.argv.includes('--dev');

// common to all builds
const common = {
    entryPoints: ['./src/index.js'],
    minify: !DEV,
    sourcemap: DEV && 'inline',
    bundle: true
}

// module specific
const builds = {
    // Node module
    cjs: {
        outfile: pkg.main
    },
    // ES6 module
    esm: {
        outfile: pkg.module,
    },
    // Browser bundle
    iife: {
        globalName: 'Storxy',
        outfile: DEV ? './test/visual/storxy.test.js' : pkg.cdn,
    }
};

Object.keys(builds).forEach(key => {
    const options = {
        ...common,
        ...builds[key],
        format: key
    }
    build(options);
});