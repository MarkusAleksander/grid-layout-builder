/* eslint-disable */
const { watch, src, dest, series, parallel } = require("gulp"),
    babel = require("gulp-babel"),
    postcss = require("gulp-postcss"),
    rollup = require("gulp-better-rollup"),
    cleanup = require("rollup-plugin-cleanup"),
    del = require("del"),
    prettier = require("gulp-prettier"),
    csso = require("gulp-csso"),
    terser = require("gulp-terser"),
    rename = require("gulp-rename"),
    jest = require("gulp-jest").default;

const src_folder = "src/",
    prod_folder = "prod/",
    test_folder = "tests/",
    modules_folder = "modules/";

const settings = {
    clean: true,
};

const paths = {
    src: src_folder,
    prod: prod_folder,
    test: test_folder,
    modules: modules_folder,

    html: {
        src: `${src_folder}html/`,
        prod: `${prod_folder}html/`,
    },

    css: {
        src: `${src_folder}css/`,
        prod: `${prod_folder}css/`,
    },

    js: {
        src: `${src_folder}js/`,
        prod: `${prod_folder}js/`,
    },

    assets: {
        src: `${src_folder}assets/`,
        prod: `${prod_folder}assets/`,
    },

    tests: {
        modules: `${test_folder}modules/`,
    },
};

/**
 * Process Javascript Files
 */
function javascript() {
    return src(`${paths.js.src}*.js`)
        .pipe(
            rollup(
                {
                    plugins: [
                        cleanup({
                            maxEmptyLines: -1,
                            comments: "all",
                            sourcemap: false,
                        }),
                    ],
                },
                {
                    format: "iife",
                }
            )
        )
        .pipe(babel())
        .pipe(prettier())
        .pipe(dest(paths.js.prod))
        .pipe(rename({ suffix: ".min" }))
        .pipe(terser())
        .pipe(dest(paths.js.prod));
}

/**
 * Process CSS Files
 */
function css() {
    return src(`${paths.css.src}*.css`)
        .pipe(postcss())
        .pipe(dest(paths.css.prod));
}
// exports.css = css;

/**
 * Process HTML files
 */
function html() {
    return src(`${paths.html.src}*.html`).pipe(dest(paths.html.prod));
}
// exports.html = html;

/**
 * Process Assets
 */
function assets() {
    return src(`${paths.assets.src}*`).pipe(dest(paths.assets.prod));
}
// exports.assets = assets;

/**
 * Watch All files
 */
function watchSrc(done) {
    watch(paths.src, series(exports.default));
    done();
}

/**
 * Clear all files from both src and prod
 */
function clear() {
    return del([
        `${paths.html.src}*`,
        `${paths.css.src}*`,
        `${paths.js.src}*`,
        `${paths.assets.src}*`,
        `${paths.html.prod}*`,
        `${paths.css.prod}*`,
        `${paths.js.prod}*`,
        `${paths.assets.prod}*`,
    ]);
}

/**
 * Clear all files from src only
 */
function clearSrc() {
    return del([
        `${paths.html.src}*`,
        `${paths.css.src}*`,
        `${paths.js.src}*`,
        `${paths.assets.src}*`,
    ]);
}
exports.clearSrc = clearSrc;

/**
 * Clear all files from prod only
 */
function clearProd(done) {
    if (!settings.clean) return done();

    del.sync([paths.prod]);

    return done();
}
exports.clearProd = clearProd;

/**
 * Default scripts
 */
exports.default = series(clearProd, parallel(html, javascript, css, assets));

/**
 * Watch Script
 */
exports.watch = series(exports.default, watchSrc);

function cleanTestModules(done) {
    del.sync([paths.tests.modules]);

    return done();
}

function transformESModulesToCommonJS() {
    return src(`${paths.modules}*.js`)
        .pipe(
            babel({
                plugins: ["@babel/plugin-transform-modules-commonjs"],
            })
        )
        .pipe(dest(`${paths.tests.modules}`));
}

/**
 * Run Tests
 */
exports.buildTests = series(cleanTestModules, transformESModulesToCommonJS);
